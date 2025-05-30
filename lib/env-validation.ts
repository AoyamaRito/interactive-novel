// 環境変数の検証と安全な取得
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    // ビルド時はダミー値を返す（実行時に正しい値が必要）
    if (process.env.NODE_ENV === 'production' && !process.env.RAILWAY_ENVIRONMENT) {
      console.warn(`Missing environment variable: ${key}`);
      return 'dummy-value-for-build';
    }
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

// オプショナルな環境変数の取得
export function getOptionalEnv(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

// 起動時に必須環境変数を検証
export function validateEnvVars() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'OPENAI_API_KEY',
    'LUMA_API_KEY'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// 開発環境でのみ環境変数を検証（本番環境では起動時エラーを避ける）
if (process.env.NODE_ENV === 'development') {
  try {
    validateEnvVars();
  } catch (error) {
    console.warn('Environment variable validation failed:', error);
  }
}