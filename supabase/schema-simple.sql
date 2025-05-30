-- AI創作プラットフォーム用のシンプルなスキーマ

-- ユーザープロファイル（認証ユーザーの拡張情報）
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ユーザーの課金情報
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  is_premium BOOLEAN DEFAULT false,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('inactive', 'active', 'trialing', 'canceled', 'past_due')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 生成されたコンテンツの保存（オプション）
CREATE TABLE IF NOT EXISTS generated_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('story', 'image')),
  title TEXT,
  content TEXT, -- ストーリーのテキストまたは画像URL
  metadata JSONB DEFAULT '{}', -- プロンプト、スタイル、その他のメタデータ
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 使用量の追跡（オプション）
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL CHECK (service_type IN ('story_generation', 'image_generation')),
  tokens_used INTEGER,
  cost_cents INTEGER, -- セント単位でのコスト
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS（Row Level Security）ポリシー
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- プロファイルポリシー
CREATE POLICY "ユーザーは自分のプロファイルを閲覧可能" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "ユーザーは自分のプロファイルを更新可能" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "ユーザーは自分のプロファイルを作成可能" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ユーザー課金情報ポリシー
CREATE POLICY "ユーザーは自分の課金情報を閲覧可能" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "システムのみ課金情報を更新可能" ON users
  FOR UPDATE USING (false); -- APIサーバーのservice_roleキーでのみ更新

CREATE POLICY "ユーザーアカウント作成時に課金情報も作成" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 生成コンテンツポリシー
CREATE POLICY "ユーザーは自分のコンテンツを閲覧可能" ON generated_content
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "ユーザーは自分のコンテンツを作成可能" ON generated_content
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ユーザーは自分のコンテンツを削除可能" ON generated_content
  FOR DELETE USING (auth.uid() = user_id);

-- 使用量ログポリシー
CREATE POLICY "ユーザーは自分の使用量を閲覧可能" ON usage_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "システムのみ使用量を記録可能" ON usage_logs
  FOR INSERT WITH CHECK (false); -- APIサーバーのservice_roleキーでのみ記録

-- インデックス（パフォーマンス最適化）
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_user_id ON generated_content(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_created_at ON generated_content(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at DESC);

-- トリガー関数：updated_atの自動更新
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_atトリガーの設定
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 関数：新規ユーザー登録時の初期化
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- プロファイルを作成
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  
  -- 課金情報を作成
  INSERT INTO users (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- 新規ユーザー作成時のトリガー
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();