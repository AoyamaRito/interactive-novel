import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  console.log('=== Create Portal Session Start ===');
  
  try {
    const authHeader = request.headers.get('authorization');
    const userId = authHeader?.replace('Bearer ', '');
    console.log('Auth header:', authHeader);
    console.log('User ID:', userId);

    if (!userId) {
      console.error('No user ID provided');
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'データベース接続エラー' },
        { status: 500 }
      );
    }

    // ユーザーのStripeカスタマーIDを取得
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (error || !subscription?.stripe_customer_id) {
      console.error('Subscription lookup error:', error);
      console.log('Subscription data:', subscription);
      return NextResponse.json(
        { error: 'カスタマー情報が見つかりません' },
        { status: 404 }
      );
    }

    console.log('Creating portal for customer:', subscription.stripe_customer_id);

    // Stripe請求ポータルセッションを作成
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    });
    
    console.log('Portal session created:', portalSession.id);

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Portal session creation error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    
    return NextResponse.json(
      { 
        error: '請求ポータルの作成に失敗しました',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}