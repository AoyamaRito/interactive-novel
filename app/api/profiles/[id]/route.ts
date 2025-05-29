import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabaseの初期化に失敗しました' }, { status: 500 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const body = await request.json();
    const { display_name, avatar_url, bio, favorite_genres } = body;

    if (!display_name) {
      return NextResponse.json({ error: '表示名は必須です' }, { status: 400 });
    }

    // プロフィールが自分のものか確認
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existingProfile) {
      return NextResponse.json({ error: 'プロフィールが見つかりません' }, { status: 404 });
    }

    // プロフィールを更新
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        display_name,
        avatar_url,
        bio,
        favorite_genres,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('プロフィール更新エラー:', error);
      return NextResponse.json({ error: 'プロフィールの更新に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('サーバーエラー:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabaseの初期化に失敗しました' }, { status: 500 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // 最低1つのプロフィールは必要
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id);

    if (!profiles || profiles.length <= 1) {
      return NextResponse.json({ error: '最後のプロフィールは削除できません' }, { status: 400 });
    }

    // プロフィールが自分のものか確認
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existingProfile) {
      return NextResponse.json({ error: 'プロフィールが見つかりません' }, { status: 404 });
    }

    // アクティブプロフィールの場合は別のプロフィールに切り替え
    const { data: activeProfile } = await supabase
      .from('active_profiles')
      .select('profile_id')
      .eq('user_id', user.id)
      .single();

    if (activeProfile?.profile_id === id) {
      const otherProfile = profiles.find(p => p.id !== id);
      if (otherProfile) {
        await supabase
          .from('active_profiles')
          .update({ profile_id: otherProfile.id })
          .eq('user_id', user.id);
      }
    }

    // プロフィールを削除
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('プロフィール削除エラー:', error);
      return NextResponse.json({ error: 'プロフィールの削除に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('サーバーエラー:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}