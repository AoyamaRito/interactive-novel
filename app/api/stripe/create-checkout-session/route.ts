import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICE_CONFIG } from '@/lib/stripe-server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  console.log('=== Create Checkout Session Start ===');
  
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    const { user_id, email } = body;

    if (!user_id || !email) {
      console.error('Missing user info:', { user_id, email });
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

    // Price IDを確認
    console.log('PRICE_CONFIG.PREMIUM_MONTHLY:', PRICE_CONFIG.PREMIUM_MONTHLY);
    console.log('process.env.STRIPE_PRICE_ID:', process.env.STRIPE_PRICE_ID);
    
    if (!process.env.STRIPE_PRICE_ID) {
      console.error('STRIPE_PRICE_ID is not set in environment variables');
      return NextResponse.json(
        { error: 'Stripe価格IDが設定されていません' },
        { status: 500 }
      );
    }

    // チェックアウトセッションを作成
    console.log('Creating checkout session with price:', process.env.STRIPE_PRICE_ID);
    
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
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
    
    // エラーメッセージを詳細に
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    
    return NextResponse.json(
      { 
        error: 'チェックアウトセッションの作成に失敗しました',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}