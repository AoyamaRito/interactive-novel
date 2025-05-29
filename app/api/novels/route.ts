import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
    const { title, content, genre, summary } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Create novel
    const { data: novel, error } = await supabase
      .from('novels')
      .insert({
        user_id: user.id,
        title,
        content,
        summary: summary || title,
        genre: genre ? [genre] : ['Fantasy'],
        generated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Novel creation error:', error);
      return NextResponse.json({ error: 'Failed to create novel' }, { status: 500 });
    }

    return NextResponse.json({ novel });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error occurred' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to initialize Supabase' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let query = supabase
      .from('novels')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: novels, error } = await query;

    if (error) {
      console.error('Novels fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch novels' }, { status: 500 });
    }

    return NextResponse.json({ novels: novels || [] });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error occurred' }, { status: 500 });
  }
}