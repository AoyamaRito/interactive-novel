import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// 許可されたリダイレクト先を定義
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  'https://interactive-novel-production.up.railway.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001'
].filter(Boolean);

function isAllowedOrigin(origin: string): boolean {
  // 開発環境では柔軟にlocalhostを許可
  if (process.env.NODE_ENV === 'development' && 
      (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
    return true;
  }
  
  return ALLOWED_ORIGINS.some(allowed => 
    allowed && origin.startsWith(allowed)
  );
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  let origin = requestUrl.origin;

  // セキュリティ: リダイレクト先の検証
  if (!isAllowedOrigin(origin)) {
    console.warn('Unauthorized origin attempted:', origin);
    return NextResponse.json(
      { error: 'Unauthorized origin' },
      { status: 400 }
    );
  }

  // 本番環境では強制的に正しいoriginを使用
  if (origin.includes('localhost') && process.env.NEXT_PUBLIC_APP_URL && process.env.NODE_ENV === 'production') {
    origin = process.env.NEXT_PUBLIC_APP_URL;
  }

  // エラーがある場合は安全にリダイレクト（XSS対策）
  if (error) {
    console.error('Auth callback error:', error, errorDescription);
    // エラーメッセージは直接URLに含めない
    return NextResponse.redirect(`${origin}/login?auth_error=true`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?auth_error=missing_code`);
  }

  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.redirect(`${origin}/login?auth_error=service_unavailable`);
    }

    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
    if (sessionError) {
      console.error('Session exchange error:', sessionError);
      return NextResponse.redirect(`${origin}/login?auth_error=session_failed`);
    }

    // 認証成功 - ホームページへリダイレクト
    return NextResponse.redirect(`${origin}/`);
  } catch (error) {
    console.error('Unexpected auth callback error:', error);
    return NextResponse.redirect(`${origin}/login?auth_error=unexpected`);
  }
}