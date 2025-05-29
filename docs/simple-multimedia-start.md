# シンプルなマルチメディアLeafの始め方

## 🌱 最小実装から始める

### Step 1: テキスト + ムード設定
```yaml
leaf:
  text: "雨が窓を叩く音だけが、静寂を破っていた。"
  mood: "melancholic"
  suggested_color: "#4A5568"  # 暗めのグレー
```

→ UIで背景色が自動的に変わる

### Step 2: AI生成の挿絵候補
```yaml
leaf:
  text: "雨が窓を叩く音だけが、静寂を破っていた。"
  visual_prompt: "rain on window, melancholic mood, dark interior"
  visual_style: "watercolor"
```

→ ユーザーが「挿絵を生成」ボタンを押すとAIが生成

### Step 3: シンプルなBGM選択
```yaml
leaf:
  text: "雨が窓を叩く音だけが、静寂を破っていた。"
  bgm_preset: "rain_ambience"  # プリセットから選択
  volume: 0.3
```

→ 無料の環境音ライブラリから自動選択

## 💡 ユーザー体験の段階

### 初心者向け
```
1. テキストを書く
2. ムードを選ぶ（楽しい/悲しい/緊張/平和）
3. 自動的に色とBGMが設定される
```

### 中級者向け
```
1. テキストを書く
2. AI画像生成プロンプトを調整
3. BGMをプリセットから選択
4. トランジション効果を選ぶ
```

### 上級者向け
```
1. すべての要素を細かく制御
2. タイムライン編集
3. インタラクション設定
```

## 🛠 技術的な簡略化

### 当面避けるべきこと
- ❌ 動画アップロード
- ❌ リアルタイムレンダリング
- ❌ 複雑な同期処理
- ❌ 3D/VR要素

### 現実的にできること
- ✅ 静止画 + Ken Burnsエフェクト（ズーム/パン）
- ✅ テキストのフェードイン/アウト
- ✅ プリセットBGMのループ再生
- ✅ シンプルなページめくりアニメーション

## 📊 コスト管理

### 無料プラン
- テキストのみ
- 基本的なムード設定
- プリセットBGM（5種類）

### 有料プラン
- AI画像生成（月50枚まで）
- BGMライブラリ全開放
- カスタムカラーパレット

### プレミアム
- 無制限のAI生成
- 動画対応（将来）
- チーム共有機能

## 🎯 MVP機能セット

```typescript
// 最初のリリースで実装する機能
interface SimplifiedMultimediaLeaf {
  // テキスト（必須）
  text: {
    content: string;
    style?: 'normal' | 'emphasis' | 'whisper';
  };
  
  // ビジュアル（オプション）
  visual?: {
    type: 'color' | 'gradient' | 'image';
    value: string; // color code, gradient CSS, or image URL
  };
  
  // オーディオ（オプション）
  audio?: {
    preset: 'rain' | 'forest' | 'city' | 'silence';
    volume: number;
  };
  
  // トランジション（オプション）
  transition?: {
    type: 'fade' | 'slide' | 'none';
    duration: number; // ms
  };
}
```

## 🚀 段階的拡張計画

### 3ヶ月後
- AI画像生成統合
- 基本的なアニメーション

### 6ヶ月後  
- カスタムBGMアップロード
- 簡単な音声同期

### 1年後
- 短い動画クリップ対応
- インタラクティブ要素

### 将来
- フルマルチメディア体験
- VR/AR対応