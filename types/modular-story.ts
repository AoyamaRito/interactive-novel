// モジュラー・ストーリー・システムの型定義

// 基本単位：ショートショート
export interface StoryModule {
  id: string;
  title: string;
  type: 'episode' | 'connector' | 'interlude';
  wordCount: number;
  
  // 独立性のレベル（1-5）
  // 5: 完全に独立した短編
  // 3: 一部キャラクターを共有
  // 1: 前後の文脈が必要
  independenceLevel: number;
  
  // コンテンツ
  content: {
    text: string;
    summary: string;
    mood: 'light' | 'dark' | 'neutral' | 'emotional';
  };
  
  // 登場要素
  elements: {
    characters: string[];
    locations: string[];
    items: string[];
    themes: string[];
  };
  
  // 接続情報
  connections: {
    requires?: string[];      // 前提となるモジュールID
    introduces?: string[];    // 導入する要素
    resolves?: string[];      // 解決する伏線
    foreshadows?: string[];   // 張る伏線
  };
  
  // メタデータ
  metadata: {
    genre?: string;
    targetAudience?: string;
    createdAt: string;
    aiGenerated?: boolean;
  };
}

// モジュールの組み合わせルール
export interface CombinationRule {
  id: string;
  name: string;
  description: string;
  
  // 条件
  conditions: {
    minModules?: number;
    maxModules?: number;
    requiredTypes?: StoryModule['type'][];
    moodProgression?: string[]; // 例: ['light', 'dark', 'light']
  };
  
  // 制約
  constraints: {
    // 同じキャラクターの登場間隔
    characterSpacing?: {
      character: string;
      minModulesBetween: number;
    }[];
    
    // テーマの出現頻度
    themeFrequency?: {
      theme: string;
      maxPercentage: number;
    }[];
  };
}

// 長編構造
export interface NovelStructure {
  id: string;
  title: string;
  
  // 章構成
  chapters: {
    id: string;
    title: string;
    modules: string[]; // StoryModule IDs
    transitionType: 'smooth' | 'cliffhanger' | 'time-skip' | 'perspective-shift';
  }[];
  
  // 全体アーク
  storyArcs: {
    id: string;
    name: string;
    startModule: string;
    endModule: string;
    keyModules: string[];
    arcType: 'main' | 'sub' | 'character' | 'thematic';
  }[];
  
  // 自動生成された統計
  statistics: {
    totalWordCount: number;
    totalModules: number;
    averageIndependence: number;
    characterAppearances: Record<string, number>;
    themeDistribution: Record<string, number>;
  };
}

// コンバイン戦略
export interface CombineStrategy {
  name: string;
  
  // 基本戦略
  approach: 'linear' | 'branching' | 'circular' | 'mosaic';
  
  // つなぎ方
  transitionStyle: {
    // モジュール間の移行をどう処理するか
    betweenEpisodes: 'ai-generate' | 'template' | 'direct';
    
    // 時間経過の扱い
    timeProgression: 'continuous' | 'episodic' | 'non-linear';
    
    // 視点の扱い
    perspectiveHandling: 'consistent' | 'rotating' | 'omniscient';
  };
  
  // AI生成オプション
  aiOptions: {
    // つなぎテキストの生成
    generateTransitions: boolean;
    
    // 矛盾の自動解決
    resolveInconsistencies: boolean;
    
    // スタイルの統一
    harmonizeWritingStyle: boolean;
    
    // 伏線の自動追加
    injectForeshadowing: boolean;
  };
}

// 実行時のコンバイナー
export interface StoryModuleCombiner {
  // モジュールを結合
  combine(
    modules: StoryModule[],
    structure: NovelStructure,
    strategy: CombineStrategy
  ): Promise<{
    fullText: string;
    chapters: Array<{
      title: string;
      content: string;
    }>;
    metadata: {
      generatedTransitions: string[];
      resolvedInconsistencies: string[];
      addedForeshadowing: string[];
    };
  }>;
  
  // 整合性チェック
  validateCombination(
    modules: StoryModule[],
    rules: CombinationRule[]
  ): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  };
  
  // 最適な組み合わせを提案
  suggestOptimalCombination(
    availableModules: StoryModule[],
    targetLength: number,
    preferences: {
      genre?: string;
      mood?: string;
      complexity?: 'simple' | 'moderate' | 'complex';
    }
  ): NovelStructure[];
}

// ショートショート生成プロンプト
export interface ModuleGenerationPrompt {
  // 基本設定
  setting: {
    worldContext?: string;
    timeframe?: string;
    atmosphere?: string;
  };
  
  // 制約
  constraints: {
    wordCount: { min: number; max: number };
    mustInclude?: {
      characters?: string[];
      locations?: string[];
      items?: string[];
    };
    mustAvoid?: string[];
  };
  
  // スタイル指定
  style: {
    tone: string;
    pacing: 'fast' | 'moderate' | 'slow';
    focusOn: 'action' | 'character' | 'atmosphere' | 'dialogue';
  };
  
  // 接続要件
  connections?: {
    continueFrom?: string; // 前のモジュールのID
    setupFor?: string;     // 次のモジュールのID
    resolvePlotPoint?: string;
    introducePlotPoint?: string;
  };
}