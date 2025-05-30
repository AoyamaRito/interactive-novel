import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 許可されたオリジン
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL || '',
  'http://localhost:3000',
  'http://localhost:3001'
].filter(Boolean);

// CORS対応が必要なAPIパス
const API_PATHS = ['/api/'];

export function middleware(request: NextRequest) {
  // APIルートの場合のみCORS処理
  const isApiRoute = API_PATHS.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isApiRoute) {
    const origin = request.headers.get('origin') || '';
    
    // プリフライトリクエストの処理
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 200 });
      
      if (ALLOWED_ORIGINS.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Credentials', 'true');
      }
      
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      response.headers.set('Access-Control-Max-Age', '86400');
      
      return response;
    }
    
    // 通常のリクエストの処理
    const response = NextResponse.next();
    
    if (ALLOWED_ORIGINS.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    
    // セキュリティヘッダーの追加
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    return response;
  }
  
  // 非APIルートはそのまま通す
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};