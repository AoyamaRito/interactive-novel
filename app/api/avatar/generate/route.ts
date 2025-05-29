import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { LumaClient } from '@/lib/luma';
import { createPromptEnhancer } from '@/lib/ai/prompt-enhancer';

// プロンプトを強化する関数
function enhancePrompt(userPrompt: string, style: string): string {
  // スタイルに応じた修飾語を追加
  const styleModifiers: Record<string, string> = {
    'アニメ風': 'anime style, cel shaded, vibrant colors',
    'リアリスティック': 'photorealistic, detailed textures, natural lighting',
    'ファンタジー': 'fantasy art style, magical atmosphere, ethereal',
    'サイバーパンク': 'cyberpunk aesthetic, neon colors, futuristic',
    'ミニマリスト': 'minimalist design, clean lines, simple shapes',
  };

  const styleModifier = styleModifiers[style] || style;
  
  // プロンプトの強化
  const enhancedPrompt = `
    ${styleModifier} portrait avatar,
    ${userPrompt},
    high quality, ultra detailed, sharp focus,
    professional lighting, suitable for profile picture,
    centered composition, clean background,
    8k resolution, masterpiece
  `.trim().replace(/\s+/g, ' ');

  return enhancedPrompt;
}

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
    const { prompt, style = 'アニメ風', aiProvider } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'プロンプトは必須です' }, { status: 400 });
    }

    const lumaApiKey = process.env.LUMA_API_KEY;
    if (!lumaApiKey) {
      return NextResponse.json({ error: 'Luma APIキーが設定されていません' }, { status: 500 });
    }

    // プロンプトを強化
    let enhancedPrompt: string;
    const promptEnhancer = createPromptEnhancer(aiProvider as 'openai' | 'xai' | undefined);
    
    if (promptEnhancer) {
      // AIを使用してプロンプトを強化
      enhancedPrompt = await promptEnhancer.enhanceAvatarPrompt(prompt, style);
    } else {
      // フォールバック：基本的な強化
      enhancedPrompt = enhancePrompt(prompt, style);
    }

    // Luma APIクライアントを初期化
    const luma = new LumaClient(lumaApiKey);

    // 画像生成を開始
    const generation = await luma.generateImage(enhancedPrompt, '1:1');

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