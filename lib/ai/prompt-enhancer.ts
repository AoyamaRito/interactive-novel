import OpenAI from 'openai';

interface PromptEnhancerConfig {
  provider: 'openai' | 'xai';
  model?: string;
  apiKey: string;
}

export class PromptEnhancer {
  private openai?: OpenAI;
  private config: PromptEnhancerConfig;

  constructor(config: PromptEnhancerConfig) {
    this.config = config;
    
    if (config.provider === 'openai') {
      this.openai = new OpenAI({
        apiKey: config.apiKey,
      });
    } else if (config.provider === 'xai') {
      // Grok-3用の設定（xAI APIを使用）
      this.openai = new OpenAI({
        apiKey: config.apiKey,
        baseURL: 'https://api.x.ai/v1',
      });
    }
  }

  async enhanceAvatarPrompt(userPrompt: string, style: string): Promise<string> {
    if (!this.openai) {
      throw new Error('AI provider not initialized');
    }

    const systemPrompt = `You are an expert at creating detailed image generation prompts for AI avatar creation.
Your task is to enhance user prompts to create high-quality, professional avatar images.

Guidelines:
- Keep the original intent of the user's description
- Add technical details for better image quality
- Include style-specific keywords
- Ensure the prompt is suitable for portrait/avatar generation
- Keep the output concise but detailed
- Output only the enhanced prompt, no explanations`;

    const userMessage = `Style: ${style}
User description: ${userPrompt}

Create an enhanced prompt for generating a high-quality avatar image.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: this.config.model || (this.config.provider === 'openai' ? 'gpt-4o-mini' : 'grok-beta'),
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 200,
      });

      return completion.choices[0]?.message?.content || userPrompt;
    } catch (error) {
      console.error('Prompt enhancement failed:', error);
      // フォールバック：基本的な強化のみ
      return this.basicEnhancement(userPrompt, style);
    }
  }

  private basicEnhancement(userPrompt: string, style: string): string {
    const styleModifiers: Record<string, string> = {
      'アニメ風': 'anime style, cel shaded, vibrant colors',
      'リアリスティック': 'photorealistic, detailed textures, natural lighting',
      'ファンタジー': 'fantasy art style, magical atmosphere, ethereal',
      'サイバーパンク': 'cyberpunk aesthetic, neon colors, futuristic',
      'ミニマリスト': 'minimalist design, clean lines, simple shapes',
    };

    const styleModifier = styleModifiers[style] || style;
    
    return `${styleModifier} portrait avatar, ${userPrompt}, high quality, ultra detailed, sharp focus, professional lighting, suitable for profile picture, centered composition, clean background, 8k resolution, masterpiece`.trim();
  }
}

// ファクトリー関数
export function createPromptEnhancer(preferredProvider?: 'openai' | 'xai'): PromptEnhancer | null {
  // OpenAI設定
  const openaiKey = process.env.OPENAI_API_KEY;
  const openaiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  
  // xAI (Grok)設定
  const xaiKey = process.env.XAI_API_KEY;
  const xaiModel = process.env.XAI_MODEL || 'grok-beta';

  // 優先プロバイダーが指定されている場合
  if (preferredProvider) {
    if (preferredProvider === 'openai' && openaiKey) {
      return new PromptEnhancer({
        provider: 'openai',
        apiKey: openaiKey,
        model: openaiModel,
      });
    } else if (preferredProvider === 'xai' && xaiKey) {
      return new PromptEnhancer({
        provider: 'xai',
        apiKey: xaiKey,
        model: xaiModel,
      });
    }
  }

  // デフォルト優先順位: OpenAI -> xAI
  if (openaiKey) {
    return new PromptEnhancer({
      provider: 'openai',
      apiKey: openaiKey,
      model: openaiModel,
    });
  }

  if (xaiKey) {
    return new PromptEnhancer({
      provider: 'xai',
      apiKey: xaiKey,
      model: xaiModel,
    });
  }

  console.warn('No AI provider configured, using basic prompt enhancement');
  return null;
}