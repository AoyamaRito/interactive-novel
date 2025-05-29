import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  console.log('=== Verify Session Start ===');
  
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    const { session_id } = body;

    if (!session_id) {
      console.error('Missing session_id');
      return NextResponse.json(
        { error: 'セッションIDが必要です' },
        { status: 400 }
      );
    }

    console.log('Retrieving session:', session_id);
    
    // Stripeセッションを取得
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['subscription', 'customer'],
    });
    
    console.log('Session retrieved:', {
      id: session.id,
      payment_status: session.payment_status,
      metadata: session.metadata
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
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30日後
      });

    if (insertError) {
      console.error('Subscription insert error:', insertError);
      return NextResponse.json(
        { error: 'サブスクリプション情報の保存に失敗しました' },
        { status: 500 }
      );
    }

    // ユーザーのプレミアムステータスも更新
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ 
        is_premium: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', user_id);

    if (userUpdateError) {
      console.error('User update error:', userUpdateError);
      // エラーが出ても続行
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session verification error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    
    return NextResponse.json(
      { 
        error: 'セッションの検証に失敗しました',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}