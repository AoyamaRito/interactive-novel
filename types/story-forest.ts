// Story Forest System - 物語の自然階層構造

// 🌿 Leaf（葉）- 最小単位
export interface StoryLeaf {
  id: string;
  type: 'scene' | 'dialogue' | 'description' | 'action' | 'thought';
  content: string;
  wordCount: number;
  
  // 葉の特性
  attributes: {
    season?: 'spring' | 'summer' | 'autumn' | 'winter'; // 物語の時期
    health: 'fresh' | 'mature' | 'withering'; // 鮮度・relevance
    color?: string; // 感情的なトーン
  };
  
  // 栄養素（物語要素）
  nutrients: {
    emotion?: string;
    information?: string;
    conflict?: string;
    resolution?: string;
  };
  
  // この葉が必要とする文脈
  requires: {
    characters?: string[];
    knowledge?: string[];
    previousEvents?: string[];
  };
}

// 🌱 Branch（枝）- 葉の集合
export interface StoryBranch {
  id: string;
  name: string;
  
  // 枝の種類
  type: 'main' | 'side' | 'flashback' | 'parallel';
  
  leaves: StoryLeaf[];
  
  // 枝の成長方向
  growth: {
    direction: 'upward' | 'sideways' | 'downward'; // 物語の進行方向
    speed: 'rapid' | 'steady' | 'slow'; // ペース
    thickness: number; // 重要度 (1-10)
  };
  
  // 他の枝との接続
  connections: {
    parent?: string;
    children: string[];
    crossConnections: string[]; // 他の枝との交差
  };
}

// 🌳 Tree（木）- 一つの完結した物語
export interface StoryTree {
  id: string;
  species: string; // ジャンル（"mystery-oak", "romance-cherry", "fantasy-willow"）
  
  // 木の構造
  structure: {
    trunk: StoryBranch; // 主幹（メインプロット）
    branches: StoryBranch[]; // 枝（サブプロット）
    roots: { // 根（背景設定・世界観）
      worldBuilding: string[];
      characterBackgrounds: string[];
      historicalContext: string[];
    };
    crown: { // 樹冠（テーマ・メッセージ）
      themes: string[];
      messages: string[];
      atmosphere: string;
    };
  };
  
  // 木の状態
  vitality: {
    age: 'sapling' | 'young' | 'mature' | 'ancient';
    health: number; // 0-100
    season: string; // 現在の物語の段階
  };
  
  // 実（成果物）
  fruits: {
    id: string;
    type: 'chapter' | 'short-story' | 'novel';
    ripeness: 'green' | 'ripe' | 'overripe';
    content: string;
  }[];
}

// 🌲 Forest（森）- 物語群・シリーズ
export interface StoryForest {
  id: string;
  name: string;
  biome: string; // "fantasy-realm", "sci-fi-cluster", "romance-garden"
  
  // 森の構成
  trees: StoryTree[];
  
  // 森の生態系
  ecosystem: {
    // 共通キャラクター（森を渡り歩く動物のように）
    sharedCharacters: {
      id: string;
      name: string;
      appearances: Array<{
        treeId: string;
        role: string;
      }>;
    }[];
    
    // 共通テーマ（森全体の気候のように）
    climate: {
      overarchingThemes: string[];
      mood: string;
      era: string;
    };
    
    // 相互作用
    symbiosis: Array<{
      tree1: string;
      tree2: string;
      relationshipType: 'sequel' | 'prequel' | 'parallel' | 'alternate';
      sharedElements: string[];
    }>;
  };
  
  // 森の成長
  growth: {
    stage: 'establishing' | 'flourishing' | 'mature' | 'regenerating';
    canopy_coverage: number; // 0-100 (物語世界の完成度)
    biodiversity: number; // 物語の多様性
  };
  
  // 小道（読者の経路）
  paths: Array<{
    id: string;
    name: string;
    description: string;
    route: string[]; // tree IDs in order
    difficulty: 'easy' | 'moderate' | 'challenging';
    estimatedTime: number; // in hours
  }>;
}

// 🌍 生態系の管理者
export interface ForestKeeper {
  // 新しい葉を生成
  growLeaf(
    branch: StoryBranch,
    type: StoryLeaf['type'],
    prompt?: string
  ): Promise<StoryLeaf>;
  
  // 枝を剪定（編集）
  pruneBranch(
    branch: StoryBranch,
    criteria: {
      removeWithering?: boolean;
      maintainBalance?: boolean;
      preserveMainLine?: boolean;
    }
  ): StoryBranch;
  
  // 木を植える（新しい物語を開始）
  plantTree(
    seed: {
      concept: string;
      genre: string;
      targetSize: 'bonsai' | 'garden' | 'forest';
    }
  ): Promise<StoryTree>;
  
  // 森を育てる（シリーズ展開）
  cultivateForest(
    trees: StoryTree[],
    strategy: 'natural' | 'designed' | 'hybrid'
  ): Promise<StoryForest>;
  
  // 収穫（出版準備）
  harvest(
    target: StoryLeaf | StoryBranch | StoryTree | StoryForest,
    format: 'raw' | 'refined' | 'premium'
  ): {
    content: string;
    metadata: any;
    quality: number;
  };
}

// 🦋 Cross-Pollination（異花受粉）- 異なる物語間の要素交換
export interface CrossPollination {
  // アイデアの受粉
  pollinate(
    source: StoryTree,
    target: StoryTree,
    elements: {
      characters?: boolean;
      themes?: boolean;
      worldElements?: boolean;
      plotDevices?: boolean;
    }
  ): {
    newBranches: StoryBranch[];
    mutations: string[]; // 新しく生まれた要素
  };
  
  // ハイブリッド種の作成
  hybridize(
    parent1: StoryTree,
    parent2: StoryTree,
    ratio: number // 0-1 (parent1の影響度)
  ): StoryTree;
}

// 🍄 Decomposer（分解者）- 失敗作や断片を再利用
export interface StoryDecomposer {
  // 使われなかった要素を栄養に
  decompose(
    deadwood: Array<StoryLeaf | StoryBranch>
  ): {
    recyclableElements: {
      goodDialogue: string[];
      interestingConcepts: string[];
      reusableCharacters: any[];
    };
    compost: string; // AIプロンプトに使える要素集
  };
  
  // 栄養を新しい成長に
  fertilize(
    target: StoryBranch | StoryTree,
    nutrients: any
  ): void;
}