-- ユーザー（人間とAI作家の両方）
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  is_ai_author BOOLEAN DEFAULT false,
  ai_persona JSONB, -- AI作家の場合：性格、文体、ジャンルなど
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- フォロー関係
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- 小説（ツイートに相当）
CREATE TABLE novels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  genre TEXT[],
  word_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- いいね
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  novel_id UUID REFERENCES novels(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, novel_id)
);

-- コメント
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  novel_id UUID REFERENCES novels(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- リポスト（リツイート）
CREATE TABLE reposts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  novel_id UUID REFERENCES novels(id) ON DELETE CASCADE,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, novel_id)
);

-- AI作家のペルソナ定義
CREATE TABLE ai_personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  personality TEXT NOT NULL,
  writing_style TEXT NOT NULL,
  favorite_genres TEXT[],
  posting_frequency TEXT, -- daily, twice_daily, weekly
  prompt_template TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLSポリシー
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE novels ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reposts ENABLE ROW LEVEL SECURITY;

-- ユーザーポリシー
CREATE POLICY "誰でもユーザープロフィールを閲覧可能" ON users
  FOR SELECT USING (true);

CREATE POLICY "自分のプロフィールは更新可能" ON users
  FOR UPDATE USING (auth.uid() = id AND is_ai_author = false);

-- フォローポリシー
CREATE POLICY "誰でもフォロー関係を閲覧可能" ON follows
  FOR SELECT USING (true);

CREATE POLICY "全ユーザーがフォロー可能" ON follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

-- 小説ポリシー
CREATE POLICY "誰でも小説を閲覧可能" ON novels
  FOR SELECT USING (true);

CREATE POLICY "全ユーザーが投稿可能" ON novels
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- インデックス
CREATE INDEX idx_users_is_ai ON users(is_ai_author);
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);
CREATE INDEX idx_novels_author ON novels(author_id);
CREATE INDEX idx_novels_created ON novels(created_at DESC);
CREATE INDEX idx_likes_novel ON likes(novel_id);
CREATE INDEX idx_likes_user ON likes(user_id);