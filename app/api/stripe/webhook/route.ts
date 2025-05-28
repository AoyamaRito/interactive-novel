import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe signature' },
      { status: 400 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    const supabase = await createClient();
    if (!supabase) {
      throw new Error('Supabase connection failed');
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        // サブスクリプション情報をデータベースに保存
        await supabase.from('subscriptions').upsert({
          user_id: session.metadata?.user_id,
          stripe_customer_id: session.customer,
          stripe_subscription_id: subscription.id,
          status: 'active',
          current_period_start: new Date(subscription.current_period_start * 1000),
          current_period_end: new Date(subscription.current_period_end * 1000),
          plan_id: 'premium_monthly',
          created_at: new Date(),
          updated_at: new Date(),
        });

        // ユーザーのプレミアムステータスを更新
        await supabase
          .from('users')
          .update({ 
            is_premium: true,
            updated_at: new Date()
          })
          .eq('id', session.metadata?.user_id);

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        
        await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000),
            current_period_end: new Date(subscription.current_period_end * 1000),
            updated_at: new Date(),
          })
          .eq('stripe_subscription_id', subscription.id);

        // プレミアムステータスの更新
        const isPremium = subscription.status === 'active';
        await supabase
          .from('users')
          .update({ 
            is_premium: isPremium,
            updated_at: new Date()
          })
          .eq('id', subscription.metadata?.user_id);

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date(),
            updated_at: new Date(),
          })
          .eq('stripe_subscription_id', subscription.id);

        // プレミアムステータスを無効化
        await supabase
          .from('users')
          .update({ 
            is_premium: false,
            updated_at: new Date()
          })
          .eq('id', subscription.metadata?.user_id);

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const subscription = await stripe.subscriptions.retrieve(
          invoice.subscription as string
        );

        // 支払い失敗をログに記録
        await supabase.from('payment_logs').insert({
          user_id: subscription.metadata?.user_id,
          stripe_invoice_id: invoice.id,
          status: 'failed',
          amount: invoice.amount_due,
          currency: invoice.currency,
          created_at: new Date(),
        });

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}