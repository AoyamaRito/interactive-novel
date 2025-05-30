import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { withAuth, withRateLimit } from '@/lib/auth-middleware';
import { getRequiredEnv } from '@/lib/env-validation';
import OpenAI from 'openai';

// 入力値検証スキーマ
const requestSchema = z.object({
  characterIds: z.array(z.string().uuid()).min(1).max(10),
  worldIds: z.array(z.string().uuid()).max(5).optional(),
  genre: z.string().min(1).max(50),
  prompt: z.string().max(1000).optional(),
  aiProvider: z.enum(['openai', 'xai']).optional()
});

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, userId) => {
    try {
      // レート制限チェック（1分あたり10回まで）
      const { allowed, remaining } = await withRateLimit(req, userId, 10, 60000);
      
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

      const { characterIds, worldIds, genre, prompt, aiProvider } = validationResult.data;

      const supabase = await createClient();
      if (!supabase) {
        return NextResponse.json({ error: 'サービスが利用できません' }, { status: 500 });
      }

      // Get all entity IDs
      const allEntityIds = [...characterIds, ...(worldIds || [])];

      // Get selected entities (ユーザーが所有するエンティティのみ取得)
      const { data: entities, error: entityError } = await supabase
        .from('profiles')
        .select('id, display_name, bio, avatar_url, entity_type, metadata')
        .in('id', allEntityIds)
        .eq('user_id', userId); // userIdを使用

      if (entityError || !entities || entities.length === 0) {
        return NextResponse.json({ error: 'エンティティが見つかりません' }, { status: 404 });
      }

      // Separate entities by type
      const characters = entities.filter(e => !e.entity_type || e.entity_type === 'character');
      const worlds = entities.filter(e => e.entity_type === 'world');
      const organizations = entities.filter(e => e.entity_type === 'organization');
      const items = entities.filter(e => e.entity_type === 'item');
      const events = entities.filter(e => e.entity_type === 'event');
      const concepts = entities.filter(e => e.entity_type === 'concept');

      // AI configuration
      let openai: OpenAI | null = null;
      let model = 'gpt-4o-mini';

      if (aiProvider === 'xai') {
        const xaiKey = process.env.XAI_API_KEY;
        if (xaiKey) {
          openai = new OpenAI({
            apiKey: xaiKey,
            baseURL: 'https://api.x.ai/v1',
          });
          model = process.env.XAI_MODEL || 'grok-beta';
        }
      } else {
        const openaiKey = getRequiredEnv('OPENAI_API_KEY');
        openai = new OpenAI({
          apiKey: openaiKey,
        });
        model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
      }

      if (!openai) {
        return NextResponse.json({ error: 'AI サービスが利用できません' }, { status: 500 });
      }

      // Build story generation prompt
      const systemPrompt = `You are a creative story writer. Create an engaging short story using the given elements.

Requirements:
- Use each character's personality and role
- Incorporate the world settings if provided
- Include organizations, items, events, and concepts naturally
- Follow the specified genre
- 800-1200 words
- Clear story structure
- Engaging narrative`;

      let userPrompt = `Write a ${genre} story with these elements:\n\n`;

      if (characters.length > 0) {
        userPrompt += `Characters:\n${characters.map(c => `- ${c.display_name}: ${c.bio || 'Mysterious character'}`).join('\n')}\n\n`;
      }

      if (worlds.length > 0) {
        userPrompt += `World Settings:\n${worlds.map(w => `- ${w.display_name}: ${w.bio || 'A mysterious world'}`).join('\n')}\n\n`;
      }

      if (organizations.length > 0) {
        userPrompt += `Organizations:\n${organizations.map(o => `- ${o.display_name}: ${o.bio || 'A mysterious organization'}`).join('\n')}\n\n`;
      }

      if (items.length > 0) {
        userPrompt += `Items:\n${items.map(i => `- ${i.display_name}: ${i.bio || 'A mysterious item'}`).join('\n')}\n\n`;
      }

      if (events.length > 0) {
        userPrompt += `Events:\n${events.map(e => `- ${e.display_name}: ${e.bio || 'A significant event'}`).join('\n')}\n\n`;
      }

      if (concepts.length > 0) {
        userPrompt += `Concepts:\n${concepts.map(c => `- ${c.display_name}: ${c.bio || 'An abstract concept'}`).join('\n')}\n\n`;
      }

      userPrompt += `${prompt ? `Additional instructions: ${prompt}\n\n` : ''}Include a title and write an engaging story.`;

      const completion = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      });

      const story = completion.choices[0]?.message?.content || '';

      // Separate title and content
      const lines = story.split('\n');
      const title = lines[0].replace(/^#\s*/, '').trim();
      const content = lines.slice(1).join('\n').trim();

      return NextResponse.json({
        title,
        content,
        characters: entities,
        genre,
      }, {
        headers: {
          'X-RateLimit-Remaining': remaining.toString()
        }
      });
    } catch (error) {
      console.error('Story generation error:', error);
      // エラーの詳細を隠蔽
      return NextResponse.json({ 
        error: 'ストーリーの生成に失敗しました。しばらく時間をおいて再度お試しください。'
      }, { status: 500 });
    }
  });
}