import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';
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
        
        // ユーザーのプレミアムステータスを更新
        if (session.metadata?.user_id) {
          await supabase
            .from('users')
            .update({ 
              is_premium: true,
              updated_at: new Date()
            })
            .eq('id', session.metadata.user_id);
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        // プレミアムステータスを無効化
        if (subscription.metadata?.user_id) {
          await supabase
            .from('users')
            .update({ 
              is_premium: false,
              updated_at: new Date()
            })
            .eq('id', subscription.metadata.user_id);
        }

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