// You Are The Hero - 読者が主人公になるAI駆動システム

// 🎭 読者プロファイル
export interface ReaderProfile {
  id: string;
  
  // 基本設定（初回に入力）
  basics: {
    name: string; // 物語内での名前
    age?: number;
    gender?: string;
    preferences: {
      violence: 'avoid' | 'mild' | 'normal';
      romance: 'none' | 'subtle' | 'explicit';
      horror: 'none' | 'mild' | 'intense';
    };
  };
  
  // 行動パターン（自動学習）
  personality: {
    traits: Map<string, number>; // "brave": 0.8, "cautious": 0.3
    decisionHistory: Decision[];
    moralAlignment: {
      good_evil: number; // -1 (evil) to 1 (good)
      lawful_chaotic: number; // -1 (chaotic) to 1 (lawful)
    };
  };
  
  // 物語内での状態
  storyState: {
    relationships: Map<string, RelationshipStatus>;
    inventory: string[];
    skills: string[];
    reputation: Map<string, number>; // "王国": 50, "盗賊ギルド": -20
    health: number;
    mental: number;
  };
}

// 🎮 インタラクティブシーン
export interface InteractiveScene {
  id: string;
  
  // シーンの基本情報
  context: {
    location: string;
    time: string;
    presentCharacters: string[];
    mood: string;
  };
  
  // パーソナライズされたテキスト
  narrative: {
    template: string; // "{{name}}は{{location}}に立っていた。"
    personalized: string; // AIが読者に合わせて生成
    innerThoughts?: string; // 読者の性格に基づく内心
  };
  
  // 選択肢（読者の性格で変化）
  choices: Choice[];
  
  // 隠し要素
  hiddenOptions?: {
    condition: string; // "if trust_with_elena > 80"
    choice: Choice;
  }[];
}

// 選択肢
export interface Choice {
  id: string;
  text: string;
  
  // この選択の性質
  traits: {
    bravery?: number;
    kindness?: number;
    cunning?: number;
    aggression?: number;
  };
  
  // 必要条件
  requirements?: {
    skills?: string[];
    items?: string[];
    relationships?: { character: string; level: number }[];
  };
  
  // 結果の予測（AIが生成）
  preview?: {
    immediate: string; // "これは危険そうだ..."
    hint: string; // "勇気が試される"
  };
}

// 📖 ダイナミックストーリー
export interface DynamicStory {
  id: string;
  title: string;
  
  // 物語の骨格
  skeleton: {
    genre: string;
    worldSetting: WorldSetting;
    mainConflict: string;
    possibleEndings: Ending[];
  };
  
  // 現在の状態
  currentState: {
    chapter: number;
    scene: string;
    worldState: Map<string, any>; // 世界の変化
    activeQuests: Quest[];
    completedEvents: string[];
  };
  
  // AI生成パラメータ
  aiParams: {
    model: string;
    temperature: number;
    style: string; // "epic fantasy", "noir", "comedic"
    consistency: number; // 0-1: どれだけ読者の選択を覚えているか
  };
}

// 🧠 AIストーリーエンジン
export interface AIStoryEngine {
  // シーン生成
  generateScene(
    reader: ReaderProfile,
    story: DynamicStory,
    previousChoice?: Choice
  ): Promise<InteractiveScene>;
  
  // 選択の結果を処理
  processChoice(
    reader: ReaderProfile,
    choice: Choice,
    scene: InteractiveScene
  ): Promise<{
    immediateConsequence: string;
    stateChanges: StateChange[];
    newScene: InteractiveScene;
  }>;
  
  // 読者の性格を更新
  updatePersonality(
    reader: ReaderProfile,
    choice: Choice
  ): Promise<PersonalityUpdate>;
  
  // カスタム選択肢の処理
  processCustomAction(
    reader: ReaderProfile,
    action: string // フリーテキスト入力
  ): Promise<{
    interpreted: Choice;
    feasibility: number; // 0-1
    result: string;
  }>;
}

// 🎭 パーソナライゼーション
export interface PersonalizationEngine {
  // 文章スタイルの調整
  adaptNarrative(
    baseText: string,
    reader: ReaderProfile
  ): string;
  
  // 選択肢の生成
  generateChoices(
    scene: InteractiveScene,
    reader: ReaderProfile
  ): Choice[];
  
  // 内面描写の生成
  generateInnerMonologue(
    situation: string,
    reader: ReaderProfile
  ): string;
}

// 💾 セーブシステム
export interface SaveState {
  reader: ReaderProfile;
  story: DynamicStory;
  
  // 分岐の記録
  timeline: Array<{
    scene: string;
    choice: string;
    consequence: string;
    timestamp: Date;
  }>;
  
  // リプレイ可能な瞬間
  checkpoints: Array<{
    id: string;
    chapter: number;
    description: string;
  }>;
}

// 🌍 世界の反応システム
export interface WorldReactionSystem {
  // NPCの態度変化
  updateNPCAttitude(
    npc: string,
    reader: ReaderProfile,
    action: Choice
  ): Promise<AttitudeChange>;
  
  // 世界への影響
  calculateWorldImpact(
    choices: Choice[],
    worldState: Map<string, any>
  ): WorldChange[];
  
  // 噂システム
  spreadRumor(
    action: string,
    witnesses: string[]
  ): Promise<Rumor[]>;
}

// 📊 読者体験の分析
export interface ReaderAnalytics {
  // プレイスタイル
  playStyle: {
    explorer: number; // 探索好き
    achiever: number; // 達成主義
    socializer: number; // 対話重視
    fighter: number; // 戦闘好き
  };
  
  // 選択の傾向
  choicePatterns: {
    riskTaking: number;
    empathy: number;
    logic: number;
    emotion: number;
  };
  
  // 物語との相性
  storyMatch: {
    currentSatisfaction: number;
    predictedEnding: string;
    alternativeStories: string[]; // おすすめの別ストーリー
  };
}

// 🎮 リアルタイム要素
export interface RealTimeFeature {
  // 時限選択
  timedChoice: {
    deadline: number; // seconds
    defaultChoice: Choice;
    pressureLevel: 'low' | 'medium' | 'high';
  };
  
  // 他の読者の影響
  communityImpact: {
    visible: boolean;
    influence: 'none' | 'hint' | 'vote' | 'parallel';
    statistics: Map<Choice, number>; // 他の読者の選択統計
  };
  
  // ライブイベント
  liveEvent?: {
    type: 'author_intervention' | 'community_vote' | 'random_event';
    duration: number;
    impact: 'minor' | 'major' | 'critical';
  };
}

// 🎨 ビジュアル生成
export interface VisualGeneration {
  // シーンイラスト
  generateSceneImage(
    scene: InteractiveScene,
    reader: ReaderProfile
  ): Promise<string>; // image URL
  
  // キャラクターポートレート
  generateCharacterImage(
    character: string,
    relationship: number,
    mood: string
  ): Promise<string>;
  
  // 選択の視覚化
  visualizeChoice(
    choice: Choice,
    predictedOutcome: string
  ): Promise<{
    icon: string;
    color: string;
    animation: string;
  }>;
}

// 🔄 ニューゲーム＋
export interface NewGamePlus {
  // 引き継ぎ要素
  carryOver: {
    relationships?: boolean;
    skills?: boolean;
    knowledge?: boolean; // 前周の記憶
    items?: string[]; // 特定アイテムのみ
  };
  
  // 新要素
  unlocks: {
    hiddenChoices: boolean;
    alternativePaths: boolean;
    metaCommentary: boolean; // キャラが前周を認識
  };
}