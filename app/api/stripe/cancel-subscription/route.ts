import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const userId = authHeader?.replace('Bearer ', '');

    if (!userId) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { subscription_id } = body;

    if (!subscription_id) {
      return NextResponse.json(
        { error: 'サブスクリプションIDが必要です' },
        { status: 400 }
      );
    }

    // Stripeでサブスクリプションをキャンセル（期間終了時）
    await stripe.subscriptions.update(subscription_id, {
      cancel_at_period_end: true,
    });

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'データベース接続エラー' },
        { status: 500 }
      );
    }

    // データベースを更新
    await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: true,
        updated_at: new Date(),
      })
      .eq('stripe_subscription_id', subscription_id)
      .eq('user_id', userId);

    return NextResponse.json({ 
      success: true,
      message: 'サブスクリプションのキャンセルを設定しました'
    });
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    return NextResponse.json(
      { error: 'キャンセル処理に失敗しました' },
      { status: 500 }
    );
  }
}