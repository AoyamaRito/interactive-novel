# Story Forest System - 命名規則

## 🎯 ユーザー向け表示

### 日本語版
```
🌿 リーフ（Leaf）     - シーン、ひとこま
🌱 ブランチ（Branch）  - エピソード、短編
🌳 ツリー（Tree）     - 作品、ストーリー  
🌲 フォレスト（Forest）- シリーズ、世界
```

### 英語版
```
🌿 Leaf     - Scene, Moment
🌱 Branch   - Episode, Chapter
🌳 Tree     - Story, Novel
🌲 Forest   - Series, Universe
```

## 💻 システム内部での使用

### データベース
```sql
-- テーブル名
story_leaves
story_branches  
story_trees
story_forests

-- リレーション
leaf_to_branch
branch_to_tree
tree_to_forest
```

### API エンドポイント
```
/api/leaf/create
/api/branch/combine
/api/tree/grow
/api/forest/explore
```

### TypeScript 型定義
```typescript
type StoryUnit = 'leaf' | 'branch' | 'tree' | 'forest';
type StoryScale = {
  leaf:   { min: 100,   max: 500    }  // words
  branch: { min: 500,   max: 5000   }
  tree:   { min: 5000,  max: 100000 }
  forest: { min: 50000, max: Infinity }
}
```

## 🎨 UI要素での使用例

### ナビゲーション
```
📍 現在地: Forest > Tree #3 > Branch "出会い" > Leaf "カフェでの会話"
```

### 作成ボタン
```
[🌿 New Leaf] [🌱 New Branch] [🌳 New Tree] [🌲 New Forest]
```

### ステータス表示
```
Your Forest:
├─ 🌳 Trees: 3
├─ 🌱 Branches: 45  
├─ 🌿 Leaves: 234
└─ 📊 Total Words: 125,000
```

## 🎮 ユーザーアクション

### 動詞の対応
```yaml
Leaf:
  - write (書く)
  - edit (編集する)
  - polish (磨く)

Branch:  
  - grow (育てる)
  - connect (つなげる)
  - prune (剪定する)

Tree:
  - plant (植える)
  - cultivate (育成する)
  - harvest (収穫する)

Forest:
  - explore (探索する)
  - expand (拡張する)
  - manage (管理する)
```

## 📱 通知・メッセージ

### 成長の通知
```
🌱 "Your branch '初めての冒険' has grown 3 new leaves!"
🌳 "Your tree '竜と少女' is ready to harvest!"
🌲 "Your forest now contains 5 flourishing trees!"
```

### エラーメッセージ
```
⚠️ "This leaf needs to be connected to a branch first"
⚠️ "Branch is too heavy (>5000 words). Consider splitting"
⚠️ "Tree lacks a strong trunk (main plot)"
```

## 🏆 実績・バッジ

### Leaf レベル
- 🥉 Seedling Writer (10 leaves)
- 🥈 Leaf Crafter (100 leaves)  
- 🥇 Master of Moments (1000 leaves)

### Branch レベル
- 🥉 Branch Builder (5 branches)
- 🥈 Episode Expert (25 branches)
- 🥇 Storyteller (100 branches)

### Tree レベル  
- 🥉 Tree Planter (1 tree)
- 🥈 Grove Keeper (5 trees)
- 🥇 Tree Whisperer (20 trees)

### Forest レベル
- 🥉 Forest Founder (1 forest)
- 🥈 Ecosystem Creator (3 forests)
- 🥇 World Builder (10 forests)

## 🔧 開発者向けコマンド

```bash
# CLI commands
kotoha leaf create --type scene
kotoha branch grow --from leaf-123
kotoha tree plant --genre fantasy
kotoha forest explore --id forest-456

# 状態確認
kotoha status --level tree
kotoha health-check --forest my-world
```

## 📊 分析用語

```yaml
metrics:
  leaf_density: "Leaves per Branch"
  branch_spread: "Branches per Tree"  
  canopy_coverage: "Story completeness %"
  forest_biodiversity: "Unique elements count"
  growth_rate: "Words per day"
  seasonal_pattern: "Writing activity by time"
```