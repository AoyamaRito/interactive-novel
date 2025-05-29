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
    const { characterIds, worldIds, genre, prompt, aiProvider } = body;

    if (!characterIds || characterIds.length < 1) {
      return NextResponse.json({ error: 'Select at least one character' }, { status: 400 });
    }

    // Get all entity IDs
    const allEntityIds = [...(characterIds || []), ...(worldIds || [])];

    // Get selected entities
    const { data: entities, error: entityError } = await supabase
      .from('profiles')
      .select('id, display_name, bio, avatar_url, entity_type, metadata')
      .in('id', allEntityIds)
      .eq('user_id', user.id);

    if (entityError || !entities || entities.length === 0) {
      return NextResponse.json({ error: 'Entities not found' }, { status: 404 });
    }

    // Separate entities by type
    const characters = entities.filter(e => !e.entity_type || e.entity_type === 'character');
    const worlds = entities.filter(e => e.entity_type === 'world');
    const organizations = entities.filter(e => e.entity_type === 'organization');
    const items = entities.filter(e => e.entity_type === 'item');
    const events = entities.filter(e => e.entity_type === 'event');
    const concepts = entities.filter(e => e.entity_type === 'concept');

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