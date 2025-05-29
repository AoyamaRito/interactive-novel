// Leaf Harmonizer - 物語の矛盾検出と整合性調整システム

// 矛盾の種類
export type ContradictionType = 
  | 'timeline'        // 時系列の矛盾
  | 'character'       // キャラクター設定の矛盾
  | 'location'        // 場所・距離の矛盾
  | 'ability'         // 能力・スキルの矛盾
  | 'knowledge'       // 知識・情報の矛盾
  | 'relationship'    // 関係性の矛盾
  | 'worldrule'       // 世界観ルールの矛盾
  | 'emotion'         // 感情・心理の矛盾
  | 'object'          // アイテム・所持品の矛盾
  | 'state';          // 状態の矛盾（死んでいるはずなのに生きている等）

// 矛盾の検出結果
export interface Contradiction {
  id: string;
  type: ContradictionType;
  severity: 'minor' | 'major' | 'critical';
  
  // 矛盾している要素
  conflictingElements: {
    leaf1: {
      leafId: string;
      content: string;
      context: string;
    };
    leaf2: {
      leafId: string;
      content: string;
      context: string;
    };
  };
  
  // 矛盾の詳細
  description: string;
  
  // 例
  example: {
    issue: string; // "Leaf23では主人公は剣を失っているが、Leaf45では持っている"
    impact: string; // "読者が混乱する可能性が高い"
  };
  
  // 自動修正の提案
  suggestions: ResolutionSuggestion[];
}

// 解決提案
export interface ResolutionSuggestion {
  id: string;
  type: 'modify_leaf1' | 'modify_leaf2' | 'add_bridge' | 'remove_one' | 'merge';
  
  description: string;
  
  // 具体的な修正案
  changes: {
    targetLeafId?: string;
    originalText?: string;
    suggestedText?: string;
    additionalLeaf?: { // つなぎのLeafを追加する場合
      position: 'before' | 'between' | 'after';
      content: string;
    };
  };
  
  // この修正による副作用
  sideEffects: string[];
  
  // 信頼度
  confidence: number; // 0-1
}

// 整合性チェッカー
export interface ConsistencyChecker {
  // 全Leaf間の矛盾を検出
  detectContradictions(leaves: StoryLeaf[]): Promise<Contradiction[]>;
  
  // 特定の観点でチェック
  checkSpecificAspect(
    leaves: StoryLeaf[],
    aspect: 'timeline' | 'characters' | 'worldrules'
  ): Promise<Contradiction[]>;
  
  // 矛盾の影響範囲を分析
  analyzeImpact(contradiction: Contradiction, allLeaves: StoryLeaf[]): {
    affectedLeaves: string[];
    rippleEffect: string[];
    criticalPath: boolean; // メインプロットに影響するか
  };
}

// 自動修正エンジン
export interface HarmonizerEngine {
  // 矛盾を自動解決
  autoResolve(
    contradictions: Contradiction[],
    strategy: 'minimal' | 'comprehensive' | 'creative'
  ): Promise<{
    resolvedCount: number;
    modifications: LeafModification[];
    newBridgeLeaves: StoryLeaf[];
    unresolvable: Contradiction[];
  }>;
  
  // 時系列を再構築
  reorderTimeline(leaves: StoryLeaf[]): {
    reorderedLeaves: StoryLeaf[];
    timelineMarkers: Array<{
      leafId: string;
      timestamp: string;
      duration?: string;
    }>;
  };
  
  // キャラクターの一貫性を保つ
  harmonizeCharacters(
    leaves: StoryLeaf[],
    characterProfiles: Map<string, CharacterProfile>
  ): Promise<LeafModification[]>;
}

// Leaf修正情報
export interface LeafModification {
  leafId: string;
  modificationType: 'edit' | 'delete' | 'merge' | 'split';
  
  // 編集の場合
  edits?: Array<{
    original: string;
    modified: string;
    reason: string;
  }>;
  
  // マージの場合
  mergeWith?: string;
  
  // 分割の場合
  splitInto?: string[];
}

// キャラクタープロファイル（一貫性チェック用）
export interface CharacterProfile {
  name: string;
  
  // 不変の特徴
  constants: {
    appearance?: string[];
    personality?: string[];
    background?: string[];
  };
  
  // 変化する要素
  variables: {
    age?: { start: number; end: number };
    location?: string[];
    relationships?: Map<string, string[]>;
    possessions?: string[];
    abilities?: string[];
    knowledge?: string[];
  };
  
  // 成長・変化の軌跡
  evolution: Array<{
    leafId: string;
    change: string;
    reason: string;
  }>;
}

// リライトオーケストレーター
export interface RewriteOrchestrator {
  // 完全リライトプロセス
  orchestrateRewrite(
    input: {
      leaves: StoryLeaf[];
      targetStructure: 'linear' | 'multi-thread' | 'episodic';
      style?: string;
      tone?: string;
    }
  ): Promise<{
    // フェーズ1: 分析
    analysis: {
      totalLeaves: number;
      contradictions: Contradiction[];
      themes: string[];
      characterArcs: Map<string, string[]>;
    };
    
    // フェーズ2: 計画
    plan: {
      resolution: ResolutionSuggestion[];
      structure: ChapterOutline[];
      bridgeLeaves: number;
    };
    
    // フェーズ3: 実行
    execution: {
      modifiedLeaves: StoryLeaf[];
      newLeaves: StoryLeaf[];
      deletedLeaves: string[];
    };
    
    // フェーズ4: 最終原稿
    manuscript: {
      chapters: Chapter[];
      wordCount: number;
      consistencyScore: number; // 0-100
    };
  }>;
}

// 章構成
export interface ChapterOutline {
  number: number;
  title: string;
  leaves: string[]; // Leaf IDs
  summary: string;
  purpose: 'setup' | 'development' | 'climax' | 'resolution';
  wordCount: number;
}

export interface Chapter {
  number: number;
  title: string;
  content: string;
  metadata: {
    originalLeaves: string[];
    modifications: number;
    aiGenerated: number; // パーセンテージ
  };
}

// インタラクティブ修正UI用
export interface InteractiveResolver {
  // 矛盾を一つずつ解決
  presentContradiction(
    contradiction: Contradiction
  ): {
    visual: {
      leaf1Html: string;
      leaf2Html: string;
      highlightedConflicts: string[];
    };
    options: ResolutionOption[];
  };
  
  // ユーザーの選択を適用
  applyUserChoice(
    contradiction: Contradiction,
    choice: ResolutionOption
  ): Promise<{
    modified: StoryLeaf[];
    preview: string;
  }>;
}

export interface ResolutionOption {
  id: string;
  label: string;
  description: string;
  preview: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
}