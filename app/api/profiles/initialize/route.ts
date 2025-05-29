import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabaseの初期化に失敗しました' }, { status: 500 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // ユーザーのプロフィールが存在するか確認
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id);

    if (existingProfiles && existingProfiles.length > 0) {
      return NextResponse.json({ 
        message: 'プロフィールは既に存在します',
        profileCount: existingProfiles.length 
      });
    }

    // デフォルトプロフィールを作成
    const displayName = user.email?.split('@')[0] || 'ユーザー';
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        display_name: displayName,
        bio: '琴葉へようこそ！',
        favorite_genres: [],
      })
      .select()
      .single();

    if (profileError) {
      console.error('プロフィール作成エラー:', profileError);
      return NextResponse.json({ error: 'プロフィールの作成に失敗しました' }, { status: 500 });
    }

    // アクティブプロフィールとして設定
    await supabase
      .from('active_profiles')
      .upsert({
        user_id: user.id,
        profile_id: profile.id,
      });

    return NextResponse.json({ 
      message: 'デフォルトプロフィールを作成しました',
      profile 
    });
  } catch (error) {
    console.error('サーバーエラー:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}