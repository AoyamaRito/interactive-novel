import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id } = body;

    if (!session_id) {
      return NextResponse.json(
        { error: 'セッションIDが必要です' },
        { status: 400 }
      );
    }

    // Stripeセッションを取得
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['subscription', 'customer'],
    });

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: '決済が完了していません' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'データベース接続エラー' },
        { status: 500 }
      );
    }

    const subscription = session.subscription;
    const customer = session.customer;

    if (!subscription || !customer) {
      return NextResponse.json(
        { error: 'サブスクリプション情報が見つかりません' },
        { status: 400 }
      );
    }

    const user_id = session.metadata?.user_id;
    if (!user_id) {
      return NextResponse.json(
        { error: 'ユーザーIDが見つかりません' },
        { status: 400 }
      );
    }

    // サブスクリプション情報をデータベースに保存
    const subscriptionData = typeof subscription === 'string' 
      ? await stripe.subscriptions.retrieve(subscription)
      : subscription;

    const { error: insertError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: user_id,
        stripe_customer_id: typeof customer === 'string' ? customer : customer.id,
        stripe_subscription_id: subscriptionData.id,
        status: subscriptionData.status as 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid',
        price_id: subscriptionData.items.data[0].price.id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        current_period_start: new Date((subscriptionData as any).current_period_start * 1000).toISOString(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        current_period_end: new Date((subscriptionData as any).current_period_end * 1000).toISOString(),
      });

    if (insertError) {
      console.error('Subscription insert error:', insertError);
      return NextResponse.json(
        { error: 'サブスクリプション情報の保存に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json(
      { error: 'セッションの検証に失敗しました' },
      { status: 500 }
    );
  }
}