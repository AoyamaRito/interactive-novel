import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const body = await request.json();
    const { profile_id } = body;

    if (!profile_id) {
      return NextResponse.json({ error: 'profile_idは必須です' }, { status: 400 });
    }

    // プロフィールが自分のものか確認
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', profile_id)
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'プロフィールが見つかりません' }, { status: 404 });
    }

    // アクティブプロフィールを更新
    const { error } = await supabase
      .from('active_profiles')
      .upsert({
        user_id: user.id,
        profile_id: profile_id
      });

    if (error) {
      console.error('アクティブプロフィール更新エラー:', error);
      return NextResponse.json({ error: 'プロフィールの切り替えに失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('サーバーエラー:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // 現在着ているプロフィールを取得
    const { data: activeProfile, error } = await supabase
      .from('active_profiles')
      .select('profile_id, profiles(*)')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // アクティブプロフィールがない場合
      return NextResponse.json({ profile: null });
    }

    return NextResponse.json({ profile: activeProfile.profiles });
  } catch (error) {
    console.error('サーバーエラー:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}