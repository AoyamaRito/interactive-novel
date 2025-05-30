# AI創作プラットフォーム

AIを活用した画像・ストーリー生成プラットフォームのシンプルな雛形です。

## 主な機能

- **認証機能** - Supabase Authによるユーザー認証
- **決済機能** - Stripeによる月額サブスクリプション
- **AI対話機能** - OpenAI APIを使用したストーリー生成
- **画像生成機能** - Luma AI (Photon-1モデル)による画像生成

## セットアップ

### 1. 環境変数の設定

`.env.example`を`.env.local`にコピーして、必要な値を設定してください：

```bash
cp .env.example .env.local
```

必要な環境変数：
- `NEXT_PUBLIC_SUPABASE_URL` - SupabaseプロジェクトのURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabaseの公開キー
- `SUPABASE_SERVICE_ROLE_KEY` - Supabaseのサービスロールキー（サーバーサイドのみ）
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripeの公開可能キー
- `STRIPE_SECRET_KEY` - Stripeのシークレットキー
- `STRIPE_WEBHOOK_SECRET` - Stripe Webhookのシークレット
- `OPENAI_API_KEY` - OpenAI APIキー
- `LUMA_API_KEY` - Luma AIのAPIキー

### 2. 依存関係のインストール

```bash
npm install
```

### 3. データベースの設定

Supabaseプロジェクトで`supabase/schema.sql`のSQLを実行してください。

### 4. 開発サーバーの起動

```bash
npm run dev
```

## セキュリティ機能

### 実装済みのセキュリティ対策

1. **認証とレート制限**
   - すべてのAPIエンドポイントで認証チェック
   - AI生成APIにレート制限（画像生成: 1分5回、ストーリー生成: 1分10回）

2. **入力値検証**
   - Zodによる厳格な入力値検証
   - UUID形式の検証
   - 文字列長の制限

3. **セキュリティヘッダー**
   - Strict-Transport-Security (HSTS)
   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   - X-XSS-Protection
   - Referrer-Policy
   - Permissions-Policy

4. **エラーハンドリング**
   - 機密情報を含まないエラーレスポンス
   - 本番環境でのデバッグ情報の非表示

5. **Webhook検証**
   - Stripe Webhookの署名検証
   - イベントの重複処理防止
   - メタデータの検証

6. **CORS設定**
   - 許可されたオリジンのみアクセス可能
   - 適切なCORSヘッダーの設定

### セキュリティのベストプラクティス

1. **環境変数の管理**
   - `.env.local`ファイルは絶対にGitにコミットしない
   - 本番環境では環境変数を安全に管理
   - サービスロールキーはサーバーサイドでのみ使用

2. **リポジトリの設定**
   - GitHubリポジトリをプライベートに設定することを推奨
   - 機密情報を含むファイルは`.gitignore`に追加

3. **定期的な更新**
   - 依存関係の定期的なアップデート
   - `npm audit`でセキュリティ脆弱性をチェック
   - セキュリティパッチの迅速な適用

## デプロイ

### Vercel

1. VercelにGitHubリポジトリを接続
2. 環境変数を設定
3. デプロイ

### Railway

`railway.json`の設定に従ってデプロイされます。

## 開発

```bash
# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 型チェック
npm run type-check

# リント
npm run lint
```

## ライセンス

このプロジェクトはプライベートライセンスです。無断での使用・配布は禁止されています。