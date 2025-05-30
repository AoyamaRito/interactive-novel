/** @type {import('next').NextConfig} */
const nextConfig = {
  // セキュリティヘッダーの設定
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },
  
  // 画像ドメインの設定
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.lumalabs.ai',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      }
    ],
  },
  
  // 環境変数の型チェックを有効化
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLintのビルド時チェックを有効化
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig