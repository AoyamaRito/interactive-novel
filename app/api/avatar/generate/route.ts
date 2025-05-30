import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withAuth, withRateLimit } from '@/lib/auth-middleware';
import { getRequiredEnv } from '@/lib/env-validation';
import { LumaClient } from '@/lib/luma';
import { createPromptEnhancer } from '@/lib/ai/prompt-enhancer';

// 入力値検証スキーマ
const requestSchema = z.object({
  prompt: z.string().min(1).max(500),
  style: z.enum(['アニメ風', 'リアリスティック', 'ファンタジー', 'サイバーパンク', 'ミニマリスト']).default('アニメ風'),
  aiProvider: z.enum(['openai', 'xai']).optional()
});

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
  return withAuth(request, async (req, userId) => {
    try {
      // レート制限チェック（1分あたり5回まで）
      const { allowed, remaining } = await withRateLimit(req, userId, 5, 60000);
      
      if (!allowed) {
        return NextResponse.json(
          { error: 'レート制限に達しました。しばらくお待ちください。' },
          { status: 429, headers: { 'X-RateLimit-Remaining': remaining.toString() } }
        );
      }

      // リクエストボディの検証
      const body = await req.json();
      const validationResult = requestSchema.safeParse(body);
      
      if (!validationResult.success) {
        return NextResponse.json(
          { error: '入力値が不正です', details: validationResult.error.flatten() },
          { status: 400 }
        );
      }

      const { prompt, style, aiProvider } = validationResult.data;

      // 環境変数の取得
      const lumaApiKey = getRequiredEnv('LUMA_API_KEY');

      // プロンプトを強化
      let enhancedPrompt: string;
      const promptEnhancer = createPromptEnhancer(aiProvider);
      
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
      }, {
        headers: {
          'X-RateLimit-Remaining': remaining.toString()
        }
      });
    } catch (error) {
      console.error('アバター生成エラー:', error);
      // エラーの詳細を隠蔽
      return NextResponse.json({ 
        error: 'アバターの生成に失敗しました。しばらく時間をおいて再度お試しください。'
      }, { status: 500 });
    }
  });
}