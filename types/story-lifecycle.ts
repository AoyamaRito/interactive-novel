// Story Lifecycle - 妄想から長編への進化プロセス

// 💭 妄想・アイデアの種
export interface StoryIdea {
  id: string;
  createdAt: Date;
  
  // アイデアの状態
  status: 'spark' | 'growing' | 'dormant' | 'archived' | 'recycled';
  
  // 内容
  content: {
    text: string;
    trigger?: string; // 何がきっかけで思いついたか
    mood?: string;
    tags?: string[];
  };
  
  // 可能性の評価
  potential: {
    excitement: number; // 作者のワクワク度 (1-10)
    uniqueness: number; // 独自性 (1-10)
    complexity: number; // 実現の難しさ (1-10)
    marketability?: number; // 商業的可能性 (1-10)
  };
}

// 🌱 発芽したアイデア → Leaf
export interface GerminatedLeaf extends StoryLeaf {
  // 起源
  origin: {
    ideaId: string;
    germinated: Date;
    iterations: number; // 書き直した回数
  };
  
  // 成長の記録
  growth: {
    wordCountHistory: number[];
    qualityScore: number; // AI or 自己評価
    feedback?: string[];
  };
  
  // 運命
  fate: 'thriving' | 'struggling' | 'abandoned' | 'composted';
}

// 🗑️ ボツ箱（でも大切な資源）
export interface CompostBin {
  id: string;
  
  // ボツになったLeaf
  discardedLeaves: Array<{
    leaf: StoryLeaf;
    reason: DiscardReason;
    discardedAt: Date;
    salvageable: {
      goodParts: string[]; // 使える部分
      lessons: string[]; // 学んだこと
    };
  }>;
  
  // リサイクル可能な要素
  recyclableElements: {
    brilliantLines: string[]; // 素晴らしい一文
    uniqueConcepts: string[]; // ユニークなアイデア
    characterTraits: string[]; // 面白いキャラ設定
    worldDetails: string[]; // 世界観の断片
  };
  
  // 堆肥化（新しいアイデアの栄養に）
  compost: {
    themes: Map<string, number>; // テーマの出現頻度
    patterns: string[]; // 繰り返し現れるパターン
    blindSpots: string[]; // 自分の苦手分野
  };
}

// 📝 ストーリー構築プロセス
export interface StoryBuildingProcess {
  // Phase 1: 発散（Diverge）
  ideation: {
    duration: 'minutes' | 'hours' | 'days';
    method: 'freewrite' | 'prompt' | 'dream' | 'conversation';
    output: StoryIdea[];
  };
  
  // Phase 2: 実験（Experiment）
  experimentation: {
    attempts: Array<{
      ideaId: string;
      draftedLeaves: GerminatedLeaf[];
      success: boolean;
      learning: string;
    }>;
  };
  
  // Phase 3: 選別（Select）
  selection: {
    criteria: {
      minQuality: number;
      fitWithOthers: boolean;
      excitementLevel: number;
    };
    selected: string[]; // Leaf IDs
    discarded: string[]; // Leaf IDs
  };
  
  // Phase 4: 構築（Construct）
  construction: {
    method: 'linear' | 'mosaic' | 'spiral';
    structure: {
      acts: Array<{
        leaves: string[];
        purpose: string;
        transitions: string[];
      }>;
    };
  };
  
  // Phase 5: 洗練（Refine）
  refinement: {
    passes: Array<{
      focus: 'consistency' | 'pacing' | 'emotion' | 'language';
      changes: number;
      improved: boolean;
    }>;
  };
}

// 🎯 つなげる戦略
export interface ConnectionStrategy {
  name: string;
  
  // つなげ方の種類
  approach: 
    | 'chronological'     // 時系列順
    | 'thematic'         // テーマ別
    | 'emotional_arc'    // 感情の起伏
    | 'mosaic'          // モザイク的
    | 'spiral'          // 螺旋的に深まる
    | 'experimental';   // 実験的
  
  // つなぎの生成
  bridging: {
    method: 'ai_generate' | 'manual' | 'template' | 'minimal';
    style: 'smooth' | 'jarring' | 'poetic' | 'logical';
  };
  
  // 取捨選択の基準
  selectionCriteria: {
    mustInclude?: (leaf: StoryLeaf) => boolean;
    canDiscard?: (leaf: StoryLeaf) => boolean;
    qualityThreshold?: number;
  };
}

// 🔄 創作サイクル
export interface CreativeCycle {
  // 現在のフェーズ
  currentPhase: 'dreaming' | 'drafting' | 'building' | 'editing' | 'resting';
  
  // 統計
  stats: {
    totalIdeas: number;
    germinatedLeaves: number;
    discardedLeaves: number;
    recycledElements: number;
    completedTrees: number;
  };
  
  // 創作パターン分析
  patterns: {
    mostProductiveTime?: string; // "morning", "night"
    averageIdeaToLeafRatio: number; // 10個のアイデアから1個のLeafができる
    discardRate: number; // 70%がボツになる
    recycleRate: number; // ボツの30%が再利用される
  };
  
  // モチベーション管理
  motivation: {
    currentLevel: number; // 1-10
    triggers: {
      positive: string[]; // "reader feedback", "completing chapter"
      negative: string[]; // "too many discards", "writer's block"
    };
    streaks: {
      currentDaily: number;
      longestDaily: number;
    };
  };
}

// 🌟 成功した長編の解析
export interface CompletedNovelAnalysis {
  // 使用されたLeafの起源
  leafOrigins: {
    freshlyWritten: number; // %
    recycledFromDiscards: number; // %
    aiGenerated: number; // %
    collaborative: number; // %
  };
  
  // ボツ素材の活用
  discardUtilization: {
    directlyUsed: string[]; // そのまま使われたボツLeaf
    modified: string[]; // 修正して使われた
    inspired: string[]; // インスピレーションの元になった
  };
  
  // 構築プロセスの効率
  efficiency: {
    totalIdeasGenerated: number;
    totalLeavesWritten: number;
    finalLeafCount: number;
    timeSpent: {
      ideation: number; // hours
      drafting: number;
      connecting: number;
      editing: number;
    };
  };
  
  // 学習ポイント
  learnings: {
    whatWorked: string[];
    whatDidnt: string[];
    surprises: string[]; // 予想外に良かったこと
    wouldChanges: string[]; // 次回変えたいこと
  };
}

// 🎨 妄想を形にするツール
export interface IdeationTools {
  // ランダムプロンプト生成
  promptGenerator: {
    generate(category?: string): string;
    combine(elements: string[]): string;
  };
  
  // What-ifシナリオ
  whatIfMachine: {
    twist(idea: StoryIdea): StoryIdea[];
    merge(idea1: StoryIdea, idea2: StoryIdea): StoryIdea;
  };
  
  // 妄想の可視化
  visualizer: {
    mindMap(ideas: StoryIdea[]): MindMapData;
    timeline(leaves: StoryLeaf[]): TimelineData;
    connections(leaves: StoryLeaf[]): ConnectionGraph;
  };
}