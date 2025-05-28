import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICE_CONFIG } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, email } = body;

    if (!user_id || !email) {
      return NextResponse.json(
        { error: 'ユーザー情報が不足しています' },
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

    // ユーザーが存在することを確認
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    // 既存のサブスクリプションを確認
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user_id)
      .eq('status', 'active')
      .single();

    if (existingSubscription) {
      return NextResponse.json(
        { error: '既にプレミアムプランに登録されています' },
        { status: 400 }
      );
    }

    // Stripeカスタマーを作成または取得
    let customer;
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: email,
        metadata: {
          user_id: user_id,
        },
      });
    }

    // チェックアウトセッションを作成
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_CONFIG.PREMIUM_MONTHLY,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe?canceled=true`,
      metadata: {
        user_id: user_id,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout session creation error:', error);
    return NextResponse.json(
      { error: 'チェックアウトセッションの作成に失敗しました' },
      { status: 500 }
    );
  }
}