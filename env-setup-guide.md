# 環境変数設定ガイド

## 1. Supabase（新規プロジェクト）

### Supabaseダッシュボードから取得
1. https://supabase.com で新規プロジェクト作成
2. Settings → API から以下を取得：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...[長い文字列]
SUPABASE_SERVICE_KEY=eyJhbGc...[長い文字列・秘密]
```

### Supabaseで設定すること
1. **Authentication → URL Configuration**
   - Site URL: `https://kotoha-production.up.railway.app`
   - Redirect URLs に追加:
     - `https://kotoha-production.up.railway.app/**`
     - `https://kotoha-production.up.railway.app/auth/callback`
     - `http://localhost:3000/**` (開発用)

2. **Authentication → Providers → Email**
   - Enable Email Provider: ON
   - Confirm email: ON（推奨）

## 2. Stripe

### Stripeダッシュボードから取得
1. https://dashboard.stripe.com
2. 開発者 → APIキー

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...[秘密キー]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...[公開可能キー]
STRIPE_WEBHOOK_SECRET=whsec_...[Webhook設定後に取得]
```

### 商品の作成
1. 商品カタログ → 商品を追加
2. 名前: 琴葉プレミアムプラン
3. 価格: ¥980/月（継続）
4. 価格IDをコピー

```bash
STRIPE_PRICE_ID=price_...[価格ID]
```

## 3. その他の環境変数

```bash
# App
NEXT_PUBLIC_APP_URL=https://kotoha-production.up.railway.app

# Resend (メール送信・将来用)
RESEND_API_KEY=re_...[オプション]

# OpenAI (AI機能・将来用)
OPENAI_API_KEY=sk-...[オプション]
```

## 4. 完全な .env.local ファイル

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[新しいPROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=新しいanon key
SUPABASE_SERVICE_KEY=新しいservice key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# App
NEXT_PUBLIC_APP_URL=https://kotoha-production.up.railway.app

# Optional
RESEND_API_KEY=your_resend_api_key
OPENAI_API_KEY=your_openai_api_key
```

## 5. Railwayでの設定

1. Railway Dashboard → Variables
2. 上記すべての環境変数を追加
3. 特に重要なもの：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_PRICE_ID`
   - `NEXT_PUBLIC_APP_URL`

## 6. データベースの設定

Supabase SQL Editorで実行：

```sql
-- ユーザーテーブル（自動作成される）

-- サブスクリプションテーブル
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid')),
  price_id TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) を有効化
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- ポリシーを作成
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions" ON subscriptions
  FOR ALL USING (true);
```

## 7. テスト用Stripeカード

```
カード番号: 4242 4242 4242 4242
有効期限: 任意の将来の日付
CVC: 任意の3桁
```

これで完全な環境が整います！