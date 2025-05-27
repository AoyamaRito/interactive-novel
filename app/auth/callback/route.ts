import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      await supabase.auth.exchangeCodeForSession(code);
    }
  }

  // URL to redirect to after sign in process completes
  // 本番環境では明示的にURLを指定
  const redirectUrl = origin.includes('localhost') 
    ? 'http://localhost:3000/'
    : 'https://kotoha-production.up.railway.app/';
    
  return NextResponse.redirect(redirectUrl);
}