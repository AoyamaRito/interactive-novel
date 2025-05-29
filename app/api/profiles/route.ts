import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/profile';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // ユーザーの全プロフィールを取得
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('プロフィール取得エラー:', error);
      return NextResponse.json({ error: 'プロフィールの取得に失敗しました' }, { status: 500 });
    }

    // 現在着ているプロフィールを取得
    const { data: activeProfile } = await supabase
      .from('active_profiles')
      .select('profile_id')
      .eq('user_id', user.id)
      .single();

    // is_activeフラグを追加
    const profilesWithActive = profiles?.map(profile => ({
      ...profile,
      is_active: profile.id === activeProfile?.profile_id
    })) || [];

    return NextResponse.json({ profiles: profilesWithActive });
  } catch (error) {
    console.error('サーバーエラー:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const body = await request.json();
    const { display_name, avatar_url, bio, favorite_genres } = body;

    if (!display_name) {
      return NextResponse.json({ error: '表示名は必須です' }, { status: 400 });
    }

    // プロフィールを作成
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        display_name,
        avatar_url,
        bio,
        favorite_genres
      })
      .select()
      .single();

    if (error) {
      console.error('プロフィール作成エラー:', error);
      return NextResponse.json({ error: 'プロフィールの作成に失敗しました' }, { status: 500 });
    }

    // 最初のプロフィールの場合、自動的にアクティブに設定
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id);

    if (existingProfiles?.length === 1) {
      await supabase
        .from('active_profiles')
        .upsert({
          user_id: user.id,
          profile_id: profile.id
        });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('サーバーエラー:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}