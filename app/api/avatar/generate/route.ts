import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { LumaClient } from '@/lib/luma';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabaseの初期化に失敗しました' }, { status: 500 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const body = await request.json();
    const { prompt, style = 'アニメ風' } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'プロンプトは必須です' }, { status: 400 });
    }

    const lumaApiKey = process.env.LUMA_API_KEY;
    if (!lumaApiKey) {
      return NextResponse.json({ error: 'Luma APIキーが設定されていません' }, { status: 500 });
    }

    // プロンプトを構築
    const fullPrompt = `${style} portrait avatar, ${prompt}, high quality, detailed, suitable for profile picture`;

    // Luma APIクライアントを初期化
    const luma = new LumaClient(lumaApiKey);

    // 画像生成を開始
    const generation = await luma.generateImage(fullPrompt, '1:1');

    // 生成完了を待つ
    const completed = await luma.waitForCompletion(generation.id);

    if (!completed.assets?.image) {
      throw new Error('画像の生成に失敗しました');
    }

    return NextResponse.json({
      imageUrl: completed.assets.image,
      generationId: completed.id,
    });
  } catch (error) {
    console.error('アバター生成エラー:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'アバターの生成に失敗しました' 
    }, { status: 500 });
  }
}