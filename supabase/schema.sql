-- ユーザープロファイル
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium')),
  subscription_id TEXT,
  subscription_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 小説のカスタマイズ設定
CREATE TABLE novel_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  genre TEXT[] DEFAULT '{}',
  themes TEXT[] DEFAULT '{}',
  character_types TEXT[] DEFAULT '{}',
  story_length TEXT DEFAULT 'medium',
  tone TEXT DEFAULT 'balanced',
  custom_prompt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 小説
CREATE TABLE novels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  genre TEXT[],
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- いいね
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  novel_id UUID REFERENCES novels(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, novel_id)
);

-- Magic Linkトークン
CREATE TABLE magic_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLSポリシー
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE novel_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE novels ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE magic_tokens ENABLE ROW LEVEL SECURITY;

-- プロファイルポリシー
CREATE POLICY "誰でもプロファイルを閲覧可能" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "自分のプロファイルは更新可能" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 小説設定ポリシー
CREATE POLICY "自分の設定のみ閲覧可能" ON novel_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "自分の設定は更新可能" ON novel_preferences
  FOR ALL USING (auth.uid() = user_id);

-- 小説ポリシー
CREATE POLICY "全ての小説は誰でも閲覧可能" ON novels
  FOR SELECT USING (true);

CREATE POLICY "自分の小説は作成可能" ON novels
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "自分の小説は更新可能" ON novels
  FOR UPDATE USING (auth.uid() = user_id);

-- いいねポリシー
CREATE POLICY "いいねは誰でも閲覧可能" ON likes
  FOR SELECT USING (true);

CREATE POLICY "ログインユーザーはいいね可能" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "自分のいいねは削除可能" ON likes
  FOR DELETE USING (auth.uid() = user_id);

-- インデックス
CREATE INDEX idx_novels_user_id ON novels(user_id);
CREATE INDEX idx_novels_generated_at ON novels(generated_at DESC);
CREATE INDEX idx_likes_novel_id ON likes(novel_id);
CREATE INDEX idx_magic_tokens_email ON magic_tokens(email);
CREATE INDEX idx_magic_tokens_token ON magic_tokens(token);