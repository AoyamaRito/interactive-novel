import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  console.log('=== Manual Premium Activation ===');
  
  try {
    const supabase = await createClient();
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'データベース接続エラー' },
        { status: 500 }
      );
    }

    // 現在のユーザーを取得
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      );
    }

    console.log('Activating premium for user:', user.email);

    // ユーザーのプレミアムステータスを更新
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        is_premium: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'プレミアムステータスの更新に失敗しました' },
        { status: 500 }
      );
    }

    // 簡易的なサブスクリプションレコードを作成
    const { error: subError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        stripe_customer_id: 'manual_' + user.id,
        stripe_subscription_id: 'manual_sub_' + Date.now(),
        status: 'active',
        plan_id: 'premium_monthly',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30日後
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (subError) {
      console.error('Subscription error:', subError);
      // エラーが出てもプレミアムは有効にする
    }

    return NextResponse.json({ 
      success: true,
      message: 'プレミアムステータスを有効にしました'
    });
  } catch (error) {
    console.error('Manual verification error:', error);
    return NextResponse.json(
      { error: '手動検証に失敗しました' },
      { status: 500 }
    );
  }
}