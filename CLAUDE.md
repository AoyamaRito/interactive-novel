CLAUDE - 単一プロダクト自律継続ワークフロー設定
プロダクト情報
yaml
product_config:
  name: "interactive-novel"
  description: "AI創作プラットフォーム - Next.js + Supabase + Railway統合"
  
  repositories:
    primary: "https://github.com/AoyamaRito/interactive-novel"
  
  railway:
    project_id: "humble-creation"
    service_name: "interactive-novel"
    domain: "https://interactive-novel-production.up.railway.app"
  
  supabase:
    project_ref: "wlqnchogovnebuqzidbv"  
    project_id: "wlqnchogovnebuqzidbv"
    project_url: "https://wlqnchogovnebuqzidbv.supabase.co"
基本方針
Claudeは指定された単一プロダクトに対してのみ作業を行い、人間の介入を最小限に抑えて自律的にタスクを継続実行する。

CLI権限設定（プロダクト専用）
Railway CLI 権限（指定プロジェクトのみ）
yaml
railway_commands:
  project_context: "[RAILWAY_PROJECT_ID]"
  
  allowed_operations:
    project_management:
      - railway status
      - railway logs
      - railway logs --follow
      - railway logs --tail [number]
    
    deployment:
      - railway up
      - railway deploy
      - railway redeploy  
      - railway rollback
    
    service_management:
      - railway ps
      - railway restart web
      - railway restart [service-name]
    
    environment_variables:
      - railway vars
      - railway vars set [KEY=VALUE]
      - railway vars unset [KEY]
      - railway vars list
    
    database:
      - railway connect [service]
      - railway db connect
      - railway db dump
GitHub CLI 権限（指定リポジトリのみ）
yaml
gh_commands:
  repository_context: "[username]/[repository-name]"
  
  allowed_operations:
    repository:
      - gh repo view
      - gh repo clone [specified-repo-only]
    
    issues:
      - gh issue list
      - gh issue view [number]
      - gh issue create --title "[title]" --body "[body]"
      - gh issue close [number]
      - gh issue edit [number]
    
    pull_requests:
      - gh pr list
      - gh pr view [number]
      - gh pr create --title "[title]" --body "[body]"
      - gh pr merge [number]
      - gh pr close [number]
      - gh pr checkout [number]
      - gh pr diff [number]
    
    actions:
      - gh workflow list
      - gh workflow run [workflow]
      - gh run list
      - gh run view [run-id]
      - gh run cancel [run-id]
      - gh run rerun [run-id]
    
    releases:
      - gh release list
      - gh release view [tag]
      - gh release create [tag]
Supabase CLI 権限（指定プロジェクトのみ）
yaml
supabase_commands:
  project_context: "[SUPABASE_PROJECT_REF]"
  
  allowed_operations:
    project_management:
      - supabase status
      - supabase projects list
    
    local_development:
      - supabase start
      - supabase stop
      - supabase restart
      - supabase logs
    
    database:
      - supabase db push
      - supabase db pull
      - supabase db reset
      - supabase db diff
      - supabase db dump --file [file]
      - supabase db sql --file [file]
      - supabase db sql --interactive
      - supabase migration new [name]
      - supabase migration list
    
    types:
      - supabase gen types typescript --project-id [SUPABASE_PROJECT_ID]
      - supabase gen types typescript --local
    
    functions:
      - supabase functions new [name]
      - supabase functions list
      - supabase functions deploy [name]
      - supabase functions invoke [name]
      - supabase functions logs [name]
    
    secrets:
      - supabase secrets list --project-ref [SUPABASE_PROJECT_REF]
      - supabase secrets set [name=value] --project-ref [SUPABASE_PROJECT_REF]
Git操作権限（指定リポジトリのみ）
yaml
git_operations:
  repository_context: "[username]/[repository-name]"
  
  allowed_operations:
    - git status
    - git add [files]
    - git commit -m "[message]"
    - git push origin [branch]
    - git pull origin [branch]
    - git branch
    - git checkout [branch]
    - git checkout -b [new-branch]
    - git merge [branch]
    - git log
    - git diff
    - git stash
    - git stash pop
    - git fetch
  
  restricted_operations:
    - git remote add: "指定リポジトリ以外禁止"
    - git push [other-remotes]: "指定リポジトリ以外禁止"
自律実行権限
即座に実行可能（確認不要）
yaml
immediate_execution:
  code_operations:
    - バグ修正（syntax error、type error）
    - パフォーマンス最適化
    - コードリファクタリング
    - 依存関係の更新
    - ESLint/Prettier自動修正
    - テストケース作成・修正
    - ドキュメント更新
  
  database_operations:
    - データベースマイグレーション実行
    - インデックス作成・最適化
    - RLSポリシー適用
    - データバリデーション修正
    - クエリ最適化
    - 型定義生成
  
  deployment_operations:
    - 自動デプロイ実行
    - 環境変数設定
    - ログ分析・問題特定
    - 自動ロールバック（エラー発生時）
    - ヘルスチェック実行
    - パフォーマンス監視
  
  cli_operations:
    - Railway: デプロイ、ログ確認、環境変数管理
    - GitHub: PR作成、Issue管理、ワークフロー実行
    - Supabase: マイグレーション、関数デプロイ、型生成
    - Git: コミット、プッシュ、ブランチ管理
    - NPM: パッケージ管理、スクリプト実行
自動判断基準
yaml
decision_criteria:
  safety_threshold:
    - 既存機能を破壊しない変更
    - データ損失のリスクがない操作
    - 可逆性のある変更
    - テストでカバーされている範囲
  
  risk_assessment:
    low_risk: "即座に実行"
    medium_risk: "テスト後に実行"
    high_risk: "バックアップ後に実行"
    critical_risk: "人間に確認を求める"
継続実行ワークフロー
1. 開発サイクル自動化
markdown
## 自動開発サイクル

### フェーズ1: 問題検出・分析
- [ ] コンソールログ監視
- [ ] エラー報告分析
- [ ] パフォーマンス指標確認
- [ ] セキュリティスキャン実行
- [ ] 依存関係脆弱性チェック

**自動実行条件**: 毎時0分に実行
**失敗時アクション**: ログ記録後、5分後に再試行

### フェーズ2: 自動修正実装
- [ ] エラー修正コード生成
- [ ] テストケース作成
- [ ] ローカルテスト実行
- [ ] コード品質チェック
- [ ] 変更内容のドキュメント化

**自動実行条件**: 問題検出時
**失敗時アクション**: 別のアプローチで修正を試行

### フェーズ3: 自動デプロイ
- [ ] プリデプロイテスト実行
- [ ] データベースマイグレーション
- [ ] アプリケーションデプロイ
- [ ] ポストデプロイ検証
- [ ] パフォーマンス監視開始

**自動実行条件**: テスト成功時
**失敗時アクション**: 自動ロールバック実行
プロダクト統合ワークフロー
markdown
## 統合開発・デプロイサイクル

### 1. エラー検出・分析
```bash
# Railway ログ監視
railway logs --follow --project [RAILWAY_PROJECT_ID] | grep -i error

# Supabase ログ監視  
supabase logs --project-ref [SUPABASE_PROJECT_REF] | grep -i error
2. 自動Issue作成・ブランチ作成
bash
# GitHub Issue作成
gh issue create --repo [username]/[repository-name] \
  --title "Auto-detected: [error-type]" \
  --body "Error detected in production: [error-details]"

# 修正ブランチ作成
git checkout -b fix/auto-detected-error-$(date +%Y%m%d-%H%M)
3. 修正・テスト・デプロイ
bash
# コード修正後のテスト
npm test
npm run build

# 変更コミット
git add .
git commit -m "Auto-fix: [error-description]"
git push origin [branch-name]

# Pull Request作成
gh pr create --repo [username]/[repository-name] \
  --title "Auto-fix: [error-description]" \
  --body "Automatically generated fix"

# データベースマイグレーション（必要時）
supabase db push --project-ref [SUPABASE_PROJECT_REF]
supabase gen types typescript --project-id [SUPABASE_PROJECT_ID] > types/database.ts

# Railway デプロイ
railway deploy --project [RAILWAY_PROJECT_ID]
4. デプロイ検証
bash
# ヘルスチェック
curl -f https://[your-app].railway.app/api/health

# デプロイログ確認
railway logs --tail 50 --project [RAILWAY_PROJECT_ID]

# データベース接続確認
supabase db sql --project-ref [SUPABASE_PROJECT_REF] --interactive "SELECT 1;"

### 定期メンテナンス（プロダクト専用）
```markdown
## 日次メンテナンス (2:00 AM JST)

### データベースバックアップ・最適化
```bash
# Supabase バックアップ
supabase db dump --project-ref [SUPABASE_PROJECT_REF] --file "backup-$(date +%Y%m%d).sql"

# 型定義更新
supabase gen types typescript --project-id [SUPABASE_PROJECT_ID] > types/database.ts

# 変更があれば自動コミット
if [[ $(git status --porcelain) ]]; then
  git add types/database.ts
  git commit -m "Auto-update: database types $(date +%Y-%m-%d)"
  git push origin main
fi
Railway ログ分析・レポート
bash
# エラーログ分析
railway logs --project [RAILWAY_PROJECT_ID] --tail 1000 | grep -i error > daily-errors.log

# パフォーマンス分析
railway logs --project [RAILWAY_PROJECT_ID] --tail 1000 | grep -E "slow|timeout" > performance-issues.log

# 日次レポート作成
if [[ -s daily-errors.log ]] || [[ -s performance-issues.log ]]; then
  gh issue create --repo [username]/[repository-name] \
    --title "Daily Report: $(date +%Y-%m-%d)" \
    --body "$(cat daily-errors.log performance-issues.log)"
fi

### 緊急対応（プロダクト専用）
```markdown
## システムダウン対応

### Railway サービス復旧
```bash
# 1. 状況確認
railway status --project [RAILWAY_PROJECT_ID]
railway logs --project [RAILWAY_PROJECT_ID] --tail 100

# 2. サービス再起動
railway restart web --project [RAILWAY_PROJECT_ID]

# 3. 復旧確認（30秒待機）
sleep 30
curl -f https://[your-app].railway.app/api/health

# 4. 失敗時はロールバック
if [ $? -ne 0 ]; then
  railway rollback --project [RAILWAY_PROJECT_ID]
  gh issue create --repo [username]/[repository-name] \
    --title "CRITICAL: Auto-rollback executed" \
    --body "System down detected, automatic rollback performed"
fi
Supabase 接続問題対応
bash
# 1. データベース接続テスト
supabase db sql --project-ref [SUPABASE_PROJECT_REF] --interactive "SELECT 1;"

# 2. 接続失敗時の対応
if [ $? -ne 0 ]; then
  # ローカル環境での確認
  supabase start
  supabase db sql --interactive "SELECT 1;"
  
  # 問題レポート作成
  gh issue create --repo [username]/[repository-name] \
    --title "CRITICAL: Database Connection Failed" \
    --body "Supabase connection issue detected at $(date)"
fi

## 設定例（実際の値に置き換えてください）

```yaml
# 設定例 - 実際の値に置き換えて使用
example_config:
  product_config:
    name: "my-saas-app"
    
    repositories:
      primary: "https://github.com/mycompany/saas-app"
    
    railway:
      project_id: "550e8400-e29b-41d4-a716-446655440000"
      service_name: "web"
    
    supabase:
      project_ref: "abcdefghijklmnop"
      project_id: "my-project-12345"

# 使用方法:
# 1. 上記の値を実際のプロジェクト情報に置き換え
# 2. CLIで初期設定実行:
#    - railway login && railway link [project-id]
#    - supabase login && supabase link --project-ref [project-ref]  
#    - gh auth login && cd [repository] && gh repo set-default [username]/[repository-name]
プロダクト専用安全性確保
実行前チェック（指定プロダクトのみ）
yaml
safety_checks:
  repository_validation:
    - "git remote -v | grep [specified-repository]"
    - "現在のリポジトリが指定されたもの以外の場合は操作停止"
  
  railway_project_validation:
    - "railway status | grep [RAILWAY_PROJECT_ID]"
    - "異なるプロジェクトIDの場合は操作停止"
  
  supabase_project_validation:
    - "supabase status | grep [SUPABASE_PROJECT_REF]"
    - "異なるプロジェクトREFの場合は操作停止"
自動バックアップ（プロダクト専用）
yaml
auto_backup_triggers:
  before_destructive_operations:
    - "supabase db dump --project-ref [SUPABASE_PROJECT_REF] --file pre-operation-backup-$(date +%Y%m%d-%H%M).sql"
    - "git stash push -m 'Pre-operation backup $(date)'"
    - "railway logs --project [RAILWAY_PROJECT_ID] > pre-operation-logs-$(date +%Y%m%d-%H%M).log"
  
  scheduled_backups:
    hourly: "Git自動コミット（変更がある場合）"
    daily: "Supabaseデータベースダンプ"
    weekly: "完全プロジェクトバックアップ"
CLI実行制限
許可されたコンテキストのみ
yaml
execution_context:
  allowed_repositories:
    - "[username]/[repository-name]" # 指定されたリポジトリのみ
  
  allowed_railway_projects:
    - "[RAILWAY_PROJECT_ID]" # 指定されたRailwayプロジェクトのみ
  
  allowed_supabase_projects:
    - "[SUPABASE_PROJECT_REF]" # 指定されたSupabaseプロジェクトのみ

forbidden_operations:
  - "他のリポジトリへのpush"
  - "他のRailwayプロジェクトへのデプロイ"
  - "他のSupabaseプロジェクトへのマイグレーション"
  - "指定外のプロジェクトでのCLI操作"
```ation: "リードレプリカ活用"
  
  high_error_rate:
    - action: "最新デプロイのロールバック"
    - action: "エラー原因の自動分析"
    - action: "修正パッチの自動作成"
  
  security_alert:
    - action: "疑わしい接続をブロック"
    - action: "セキュリティログ収集"
    - action: "管理者通知（高優先度のみ）"
エラー処理・自動回復
自動回復戦略
yaml
recovery_strategies:
  code_errors:
    syntax_error:
      - "ESLint自動修正実行"
      - "TypeScript型エラー修正"
      - "代替実装の自動生成"
    
    runtime_error:
      - "エラーハンドリング追加"
      - "フォールバック処理実装"
      - "ログ記録とアラート設定"
  
  deployment_failures:
    build_failure:
      - "依存関係の自動修正"
      - "ビルド設定の調整"
      - "前バージョンへのロールバック"
    
    database_migration_failure:
      - "マイグレーション自動修正"
      - "データ整合性チェック"
      - "段階的マイグレーション実行"
  
  performance_issues:
    slow_queries:
      - "インデックス自動作成"
      - "クエリ最適化実行"
      - "キャッシュ戦略実装"
    
    high_memory_usage:
      - "メモリリーク検出・修正"
      - "不要なオブジェクト削除"
      - "ガベージコレクション最適化"
段階的エスカレーション
yaml
escalation_levels:
  level_1_auto: 
    duration: "0-15分"
    actions: "自動修正試行"
    success_rate: "80%期待"
  
  level_2_enhanced:
    duration: "15-60分" 
    actions: "複数手法での修正試行"
    success_rate: "95%期待"
  
  level_3_comprehensive:
    duration: "1-4時間"
    actions: "根本原因分析・包括的修正"
    success_rate: "99%期待"
  
  level_4_human_notification:
    duration: "4時間以上"
    actions: "人間への通知・支援要請"
    condition: "自動解決が困難な場合のみ"
学習・改善自動化
継続的学習
markdown
## 自動学習・改善システム

### パターン学習（毎日実行）
- [ ] エラーパターンの分析・記録
- [ ] 成功した修正手法の学習
- [ ] パフォーマンス改善効果の測定
- [ ] ユーザー行動パターンの分析
- [ ] セキュリティ脅威パターンの更新

### 自動改善実装（週次実行）
- [ ] 学習結果に基づくコード最適化
- [ ] 新しい監視指標の追加
- [ ] 自動対応ルールの改善
- [ ] アルゴリズム効率化の実装
- [ ] UI/UX改善の自動適用
実行スケジュール
常時実行タスク
yaml
continuous_tasks:
  - 監視・アラート処理
  - エラー検出・自動修正
  - パフォーマンス最適化
  - セキュリティ監視
  - ログ分析・問題特定
定期実行タスク
yaml
scheduled_tasks:
  hourly:
    - システムヘルスチェック
    - 依存関係更新チェック
    - セキュリティスキャン
  
  daily:
    - 包括的テスト実行
    - データベース保守
    - パフォーマンスレポート生成
    - バックアップ作成・検証
  
  weekly:
    - コード品質分析
    - セキュリティ監査
    - 容量計画見直し
    - 改善提案実装
  
  monthly:
    - 包括的システム分析
    - 長期パフォーマンス評価
    - 技術的負債の解消
    - アーキテクチャ改善実装
人間との協調
通知が必要なケース（最小限）
yaml
human_notification_required:
  critical_security_breach: "即座に通知"
  data_loss_risk: "即座に通知" 
  system_wide_failure: "15分以内に通知"
  budget_threshold_exceeded: "24時間以内に通知"
  major_architectural_change_needed: "週次レポートで報告"
自動判断権限
yaml
autonomous_authority:
  code_changes: "制限なし（安全性確保済み）"
  database_operations: "制限なし（バックアップ済み）"
  deployment_decisions: "制限なし（ロールバック可能）"
  resource_scaling: "予算範囲内で制限なし"
  security_measures: "制限なし（ログ記録）"
品質保証
自動品質チェック
yaml
quality_gates:
  code_quality:
    - ESLint通過率 > 95%
    - TypeScript型安全性 100%
    - テストカバレッジ > 80%
    - セキュリティスキャン クリーン
  
  performance:
    - 応答時間 < 500ms (95%tile)
    - エラー率 < 0.1%
    - 可用性 > 99.9%
    - データベース応答 < 100ms
自動ロールバック条件
yaml
rollback_triggers:
  immediate:
    - エラー率 > 5%
    - 応答時間 > 5秒
    - データベース接続失敗
    - セキュリティ脆弱性検出
  
  delayed_15min:
    - エラー率 > 1%
    - 応答時間 > 2秒
    - メモリ使用量 > 90%
    - CPU使用量 > 80%
この設定により、Claudeは最小限の人間の介入で継続的にシステムの開発・保守・改善を自律実行します。

