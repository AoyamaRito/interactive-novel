import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createPromptEnhancer } from '@/lib/ai/prompt-enhancer';
import OpenAI from 'openai';

interface CharacterProfile {
  id: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
}

interface StoryGenerationRequest {
  characterIds: string[];
  genre: string;
  prompt?: string;
  aiProvider?: 'openai' | 'xai';
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabasenk1WW~W_' }, { status: 500 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: '�<LŁgY' }, { status: 401 });
    }

    const body: StoryGenerationRequest = await request.json();
    const { characterIds, genre, prompt, aiProvider } = body;

    if (!characterIds || characterIds.length < 1) {
      return NextResponse.json({ error: 'jOh�1�n��鯿��x�WfO`UD' }, { status: 400 });
    }

    // x�U�_��գ��֗
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, display_name, bio, avatar_url')
      .in('id', characterIds)
      .eq('user_id', user.id);

    if (profileError || !profiles || profiles.length === 0) {
      return NextResponse.json({ error: '��գ��L�dK�~[�' }, { status: 404 });
    }

    // AI-�
    const openaiKey = process.env.OPENAI_API_KEY;
    const xaiKey = process.env.XAI_API_KEY;
    
    let openai: OpenAI | null = null;
    let model: string;

    if (aiProvider === 'xai' && xaiKey) {
      openai = new OpenAI({
        apiKey: xaiKey,
        baseURL: 'https://api.x.ai/v1',
      });
      model = process.env.XAI_MODEL || 'grok-beta';
    } else if (openaiKey) {
      openai = new OpenAI({
        apiKey: openaiKey,
      });
      model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    }

    if (!openai) {
      return NextResponse.json({ error: 'AI APIL-�U�fD~[�' }, { status: 500 });
    }

    // ��鯿��1�t
    const characters = profiles.map(p => ({
      name: p.display_name,
      description: p.bio || 'k~�_�i',
    }));

    // ���������Ȓ��
    const systemPrompt = `Bj_ou �ji�\�gYH��_��鯿��cfE��gՄj�����DfO`UD

��
- ��鯿�n'�;KY
- �U�_����k�c_i�
- 1000-1500�W�n��
- w�PnB��
- ��M��U�`;

    const userPrompt = `�n��鯿��{4�ihWf${genre}ni���DfO`UD

{4�i
${characters.map(c => `- ${c.name}${c.description}`).join('\n')}

${prompt ? `��n:${prompt}` : ''}

����+�fE��ji���DfO`UD`;

    try {
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

      // ����h,���
      const lines = story.split('\n');
      const title = lines[0].replace(/^#\s*/, '').replace(/^.*/, '').trim();
      const content = lines.slice(1).join('\n').trim();

      return NextResponse.json({
        title,
        content,
        characters: profiles,
        genre,
      });
    } catch (error) {
      console.error('��������:', error);
      return NextResponse.json({ 
        error: '�����nk1WW~W_' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('�������:', error);
    return NextResponse.json({ 
      error: '�������LzW~W_' 
    }, { status: 500 });
  }
}