import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, userId: string) => Promise<NextResponse>
) {
  try {
    const supabase = await createClient();
    
    // Authorizationヘッダーからトークンを取得
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7); // "Bearer " を除去

    // トークンを検証
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    // 認証成功 - ハンドラーを実行
    return handler(request, user.id);
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// レート制限用のメモリストア（本番環境ではRedisを推奨）
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export async function withRateLimit(
  request: NextRequest,
  userId: string,
  limit: number = 10,
  windowMs: number = 60000 // 1分
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `${userId}:${request.nextUrl.pathname}`;
  const now = Date.now();
  
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    // 新しいウィンドウを開始
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    });
    return { allowed: true, remaining: limit - 1 };
  }
  
  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }
  
  record.count++;
  return { allowed: true, remaining: limit - record.count };
}