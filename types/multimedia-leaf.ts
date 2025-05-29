// Multimedia Leaf System - 挿絵・文字・動画を統合した新しい物語単位

// 🍃 マルチメディアLeaf
export interface MultimediaLeaf {
  id: string;
  type: 'scene' | 'moment' | 'transition' | 'emotion' | 'revelation';
  
  // コア要素（この3つで1セット）
  core: {
    // 🎨 ビジュアル
    visual: {
      type: 'illustration' | 'photo' | 'ai-generated' | 'sketch';
      url: string;
      style?: string; // "watercolor", "anime", "realistic"
      mood?: string; // "dark", "warm", "mysterious"
      focusPoint?: { x: number; y: number }; // 視線誘導
      metadata?: {
        artist?: string;
        prompt?: string; // AI生成の場合
        palette?: string[]; // 主要色
      };
    };
    
    // 📝 テキスト
    text: {
      content: string;
      wordCount: number;
      type: 'narrative' | 'dialogue' | 'thought' | 'description';
      voiceStyle?: string; // "poetic", "minimal", "detailed"
      position?: 'overlay' | 'below' | 'beside' | 'floating';
      typography?: {
        font?: string;
        size?: string;
        animation?: 'fade' | 'typewriter' | 'float';
      };
    };
    
    // 🎬 モーション/音
    motion: {
      type: 'video' | 'animation' | 'parallax' | 'cinemagraph' | 'audio-only';
      url?: string;
      duration: number; // seconds
      
      // 動画の場合
      video?: {
        loop: boolean;
        autoplay: boolean;
        controls: boolean;
      };
      
      // アニメーションの場合
      animation?: {
        elements: Array<{
          target: string; // CSSセレクタ
          effect: string; // "float", "glow", "pulse"
          timing: string;
        }>;
      };
      
      // 音声/BGM
      audio?: {
        type: 'bgm' | 'ambience' | 'narration' | 'effect';
        volume: number; // 0-1
        fadeIn?: number;
        fadeOut?: number;
      };
    };
  };
  
  // 体験の同期設定
  synchronization: {
    // タイミング制御
    timeline: Array<{
      time: number; // seconds from start
      element: 'visual' | 'text' | 'audio';
      action: 'show' | 'hide' | 'highlight' | 'transform';
      parameters?: any;
    }>;
    
    // 読む速度に応じた調整
    pacing: 'fixed' | 'reader-controlled' | 'adaptive';
    
    // トランジション
    transitions: {
      in: 'fade' | 'slide' | 'zoom' | 'dissolve';
      out: 'fade' | 'slide' | 'zoom' | 'dissolve';
      duration: number;
    };
  };
  
  // インタラクション
  interactions?: {
    // クリック/タップ可能な領域
    hotspots?: Array<{
      area: { x: number; y: number; width: number; height: number };
      action: 'reveal-text' | 'play-sound' | 'show-detail' | 'next-leaf';
      target?: string;
    }>;
    
    // ジェスチャー
    gestures?: {
      swipe?: 'next' | 'previous' | 'menu';
      pinch?: 'zoom' | 'close';
      shake?: 'reset' | 'surprise';
    };
  };
  
  // レスポンシブ対応
  responsive: {
    mobile: {
      layout: 'vertical' | 'horizontal' | 'stack';
      textSize?: string;
      videoQuality?: 'low' | 'medium' | 'high';
    };
    tablet: {
      layout: 'side-by-side' | 'overlay' | 'book';
    };
    desktop: {
      layout: 'cinematic' | 'book' | 'immersive';
    };
  };
}

// 🌿 Leafコンバイナー
export interface LeafCombiner {
  // 複数のLeafを結合して一つの体験に
  combine(
    leaves: MultimediaLeaf[],
    strategy: CombineStrategy
  ): Promise<CombinedExperience>;
  
  // トランジションLeafの自動生成
  generateTransition(
    from: MultimediaLeaf,
    to: MultimediaLeaf,
    type: 'smooth' | 'dramatic' | 'chapter-break'
  ): Promise<MultimediaLeaf>;
  
  // スタイルの統一
  harmonizeStyle(
    leaves: MultimediaLeaf[],
    targetStyle: StyleGuide
  ): Promise<MultimediaLeaf[]>;
}

// 結合戦略
export interface CombineStrategy {
  // 表示方法
  presentation: 'linear' | 'branching' | 'parallel' | 'mosaic';
  
  // ページング
  paging: {
    type: 'scroll' | 'flip' | 'slide' | 'fade';
    leavesPerView: number; // 同時表示数
    preload: number; // 先読み数
  };
  
  // 統合レベル
  integration: {
    // ビジュアルの処理
    visuals: 'maintain' | 'blend' | 'montage';
    
    // テキストの処理
    text: 'sequential' | 'overlay' | 'merge';
    
    // 音の処理
    audio: 'crossfade' | 'layer' | 'sequential';
  };
  
  // インタラクティブ要素
  interactivity: 'minimal' | 'moderate' | 'rich';
}

// 📖 結合された体験
export interface CombinedExperience {
  id: string;
  title: string;
  
  // チャプター構造
  chapters: Array<{
    id: string;
    title: string;
    leaves: string[]; // Leaf IDs
    duration: number; // estimated minutes
    thumbnail: string;
  }>;
  
  // 全体のフロー
  flow: {
    type: 'linear' | 'branching' | 'open';
    paths?: Array<{
      id: string;
      condition?: string;
      leaves: string[];
    }>;
  };
  
  // メディア最適化
  optimization: {
    totalSize: number; // MB
    bandwidth: 'low' | 'medium' | 'high';
    offlineCapable: boolean;
    cdn?: string;
  };
  
  // エクスポート形式
  exportFormats: {
    web: boolean;      // Webサイト
    app: boolean;      // モバイルアプリ
    epub: boolean;     // 電子書籍
    video: boolean;    // 動画
    vr: boolean;       // VR体験
  };
}

// 🎬 レンダリングエンジン
export interface LeafRenderer {
  // 単一Leafの再生
  render(
    leaf: MultimediaLeaf,
    container: HTMLElement,
    options?: RenderOptions
  ): Promise<LeafPlayer>;
  
  // 複数Leafのシーケンス再生
  renderSequence(
    leaves: MultimediaLeaf[],
    container: HTMLElement,
    options?: SequenceOptions
  ): Promise<SequencePlayer>;
}

// プレイヤーコントロール
export interface LeafPlayer {
  play(): void;
  pause(): void;
  seek(time: number): void;
  
  // イベント
  onComplete: (callback: () => void) => void;
  onInteraction: (callback: (action: string) => void) => void;
  
  // 状態
  getCurrentTime(): number;
  getDuration(): number;
  getLoadingProgress(): number;
}

// スタイルガイド
export interface StyleGuide {
  name: string;
  
  visual: {
    palette: string[];
    mood: string;
    technique: string;
  };
  
  text: {
    tone: string;
    density: 'sparse' | 'balanced' | 'rich';
    fontFamily?: string;
  };
  
  motion: {
    pace: 'slow' | 'medium' | 'fast';
    smoothness: number; // 0-1
  };
  
  audio: {
    genre?: string;
    volume: number;
    presence: 'subtle' | 'balanced' | 'prominent';
  };
}

// 📱 エクスペリエンスモード
export type ExperienceMode = 
  | 'reader'      // テキスト中心
  | 'viewer'      // ビジュアル中心
  | 'immersive'   // フルマルチメディア
  | 'accessible'; // アクセシビリティ重視

// 生成プロンプト
export interface MultimediaLeafPrompt {
  // シーンの説明
  scene: {
    description: string;
    mood: string;
    importance: 'key' | 'supporting' | 'transition';
  };
  
  // 生成指示
  generation: {
    visual: {
      style: string;
      elements: string[];
      avoid?: string[];
    };
    
    text: {
      length: 'micro' | 'short' | 'medium';
      style: string;
      perspective: string;
    };
    
    audio?: {
      type: string;
      mood: string;
      duration: number;
    };
  };
  
  // 前後関係
  context?: {
    previousLeaf?: string;
    nextLeaf?: string;
    overallTheme: string;
  };
}