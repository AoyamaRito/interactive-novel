# Supabase Magic Link Debug

## 問題
- 本番環境でMagic Linkをクリックすると localhost:8080 にリダイレクトされる
- スマホでも同じ現象が発生
- Site URLは正しく設定されている

## 確認済み事項
1. Supabase Site URL: https://kotoha-production.up.railway.app ✓
2. Redirect URLs に本番URLが登録済み ✓
3. 環境変数が正しく設定されている ✓
4. 新しいブラウザ/デバイスでも同じ問題 ✓

## 可能性のある原因
1. Supabaseプロジェクトに古い設定が残っている
2. どこかにハードコードされた localhost:8080 がある
3. Supabase側のバグ

## 解決策
### オプション1: 新しいSupabaseプロジェクトを作成
1. 新規プロジェクトを作成
2. 新しいAPI キーを取得
3. 環境変数を更新
4. データベースを移行

### オプション2: Supabaseサポートに問い合わせ
- プロジェクトID: ddfdeapqdrqvcgtimhmi
- 問題: Magic Linkが常に localhost:8080 にリダイレクトされる

### オプション3: カスタム認証フローを実装
- Magic Linkを使わず、OTPコードをメール送信
- 手動でコードを入力してもらう