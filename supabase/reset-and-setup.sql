-- 既存のテーブルをクリーンアップ（必要な場合のみ実行）
-- WARNING: これは既存のデータをすべて削除します！

-- 既存のトリガーを削除
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;

-- 既存の関数を削除
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 既存のテーブルを削除（依存関係の順序に注意）
DROP TABLE IF EXISTS usage_logs CASCADE;
DROP TABLE IF EXISTS generated_content CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS novels CASCADE;
DROP TABLE IF EXISTS novel_preferences CASCADE;
DROP TABLE IF EXISTS magic_tokens CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 新しいスキーマを適用
-- schema-simple.sql の内容をここに実行してください