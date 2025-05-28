import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  let origin = requestUrl.origin;

  console.log('Auth callback - URL:', requestUrl.toString());
  console.log('Auth callback - Code:', code);
  console.log('Auth callback - Origin:', origin);

  // 本番環境では強制的に正しいoriginを使用
  if (origin.includes('localhost') && process.env.NEXT_PUBLIC_APP_URL) {
    origin = process.env.NEXT_PUBLIC_APP_URL;
    console.log('Auth callback - Fixed Origin:', origin);
  }

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(error.message)}`);
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(origin);
}