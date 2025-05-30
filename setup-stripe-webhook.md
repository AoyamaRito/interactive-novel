# Stripe Webhook設定手順

## 本番環境用のWebhook設定

### 1. Stripeダッシュボードにアクセス
[https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)

### 2. 新しいWebhookエンドポイントを作成

1. **"Add endpoint"**をクリック
2. **Endpoint URL**: `https://interactive-novel-production.up.railway.app/api/stripe/webhook`
3. **Events to send**で以下を選択:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`

### 3. Signing Secretを取得

1. 作成されたWebhookの詳細ページを開く
2. **"Signing secret"**セクションの**"Reveal"**をクリック
3. `whsec_`で始まるシークレットをコピー

### 4. Railway環境変数を更新

```bash
# 実際のWebhook Secretで更新
railway variables --set "STRIPE_WEBHOOK_SECRET=whsec_実際のシークレット値"
```

### 5. 設定の確認

```bash
# 環境変数が更新されたか確認
railway variables --kv | grep STRIPE_WEBHOOK_SECRET

# アプリケーションの再デプロイを確認
railway status
```

## テスト方法

### Stripe CLIを使用したローカルテスト

```bash
# Stripe CLIでWebhookをテスト
stripe trigger checkout.session.completed

# ログを確認
railway logs
```

### 本番環境でのテスト

1. テスト用の商品購入を実行
2. Stripeダッシュボードの**Webhook attempts**でイベントを確認
3. Railwayログで処理を確認

## トラブルシューティング

### Webhook署名検証エラーの場合

1. `STRIPE_WEBHOOK_SECRET`が正しく設定されているか確認
2. エンドポイントURLが正確か確認（末尾のスラッシュなど）
3. Stripeダッシュボードでイベントの送信状態を確認

### 環境変数が反映されない場合

```bash
# 手動で再デプロイ
railway redeploy

# ログを確認
railway logs
```