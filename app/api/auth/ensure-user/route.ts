import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
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

    // usersテーブルにユーザーが存在するか確認
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows
      console.error('User select error:', selectError);
      return NextResponse.json(
        { error: 'ユーザー確認エラー' },
        { status: 500 }
      );
    }

    // ユーザーが存在しない場合は作成
    if (!existingUser) {
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          is_premium: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error('User insert error:', insertError);
        return NextResponse.json(
          { error: 'ユーザー作成エラー' },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        message: 'ユーザーを作成しました',
        user: newUser 
      });
    }

    return NextResponse.json({ 
      message: 'ユーザーは既に存在します',
      user: existingUser 
    });
  } catch (error) {
    console.error('Ensure user error:', error);
    return NextResponse.json(
      { error: 'サーバーエラー' },
      { status: 500 }
    );
  }
}