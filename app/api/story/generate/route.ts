import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to initialize Supabase' }, { status: 500 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { characterIds, genre, prompt, aiProvider } = body;

    if (!characterIds || characterIds.length < 1) {
      return NextResponse.json({ error: 'Select at least one character' }, { status: 400 });
    }

    // Get selected profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, display_name, bio, avatar_url')
      .in('id', characterIds)
      .eq('user_id', user.id);

    if (profileError || !profiles || profiles.length === 0) {
      return NextResponse.json({ error: 'Profiles not found' }, { status: 404 });
    }

    // AI configuration
    const openaiKey = process.env.OPENAI_API_KEY;
    const xaiKey = process.env.XAI_API_KEY;
    
    let openai: OpenAI | null = null;
    let model = 'gpt-4o-mini';

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
      return NextResponse.json({ error: 'AI API not configured' }, { status: 500 });
    }

    // Prepare character information
    const characters = profiles.map(p => ({
      name: p.display_name,
      description: p.bio || 'Mysterious character',
    }));

    // Build story generation prompt
    const systemPrompt = `You are a creative story writer. Create an engaging short story using the given characters.

Requirements:
- Use each character's personality
- Follow the specified genre
- 800-1200 words
- Clear story structure
- Engaging narrative`;

    const userPrompt = `Write a ${genre} story with these characters:

Characters:
${characters.map(c => `- ${c.name}: ${c.description}`).join('\n')}

${prompt ? `Additional instructions: ${prompt}` : ''}

Include a title and write an engaging story.`;

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

      // Separate title and content
      const lines = story.split('\n');
      const title = lines[0].replace(/^#\s*/, '').trim();
      const content = lines.slice(1).join('\n').trim();

      return NextResponse.json({
        title,
        content,
        characters: profiles,
        genre,
      });
    } catch (error) {
      console.error('Story generation error:', error);
      return NextResponse.json({ 
        error: 'Failed to generate story' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ 
      error: 'Server error occurred' 
    }, { status: 500 });
  }
}