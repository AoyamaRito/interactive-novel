// 7人固定キャラクターシステム - マッチング重視設計

export interface PresetCharacter {
  id: string;
  name: string;
  role: CharacterRole;
  personality: PersonalityTraits;
  visualDescription: string;
  voiceStyle: string;
  backgroundStory: string;
  relationships: Map<string, RelationshipType>;
  specialAbilities: string[];
}

export type CharacterRole = 
  | 'protagonist'     // 主人公 - 物語の中心
  | 'mentor'          // 導師 - 知恵と指導
  | 'ally'            // 仲間 - 忠実なサポート
  | 'rival'           // ライバル - 良きライバル
  | 'love_interest'   // 恋愛相手 - ロマンス要素
  | 'comic_relief'    // ムードメーカー - 場を和ませる
  | 'mysterious'      // 謎の人物 - 物語に深みを

export interface PersonalityTraits {
  // 基本性格（0-100）
  courage: number;        // 勇気
  kindness: number;       // 優しさ
  intelligence: number;   // 知性
  humor: number;         // ユーモア
  loyalty: number;       // 忠誠心
  ambition: number;      // 野心
  mystery: number;       // 神秘性
}

export type RelationshipType = 
  | 'ally' | 'rival' | 'romantic' | 'mentor' | 'student' | 'neutral' | 'complex';

// 7人の固定キャラクター設定
export const PRESET_CHARACTERS: PresetCharacter[] = [
  {
    id: 'akira',
    name: 'アキラ',
    role: 'protagonist',
    personality: {
      courage: 85,
      kindness: 70,
      intelligence: 75,
      humor: 60,
      loyalty: 90,
      ambition: 80,
      mystery: 40
    },
    visualDescription: '黒髪、凛とした瞳、普通の学生だが芯の強さを感じさせる',
    voiceStyle: '誠実で熱い語りかけ',
    backgroundStory: '平凡な日常を送っていたが、ある出来事をきっかけに非日常の世界に足を踏み入れる',
    relationships: new Map([
      ['yuki', 'romantic'],
      ['rei', 'mentor'],
      ['hiroto', 'ally']
    ]),
    specialAbilities: ['リーダーシップ', '直感力', '諦めない心']
  },
  {
    id: 'yuki',
    name: 'ユキ',
    role: 'love_interest',
    personality: {
      courage: 65,
      kindness: 95,
      intelligence: 80,
      humor: 50,
      loyalty: 85,
      ambition: 60,
      mystery: 70
    },
    visualDescription: '銀髪、青い瞳、穏やかで美しい',
    voiceStyle: '柔らかく包み込むような話し方',
    backgroundStory: '心優しい性格だが、隠された過去がある',
    relationships: new Map([
      ['akira', 'romantic'],
      ['kaede', 'ally'],
      ['ren', 'complex']
    ]),
    specialAbilities: ['癒しの力', '共感力', '美しい歌声']
  },
  {
    id: 'rei',
    name: 'レイ',
    role: 'mentor',
    personality: {
      courage: 90,
      kindness: 75,
      intelligence: 95,
      humor: 40,
      loyalty: 80,
      ambition: 70,
      mystery: 85
    },
    visualDescription: '長い黒髪、鋭い眼差し、威厳のある立ち振る舞い',
    voiceStyle: '冷静で知的、時に厳しく',
    backgroundStory: '多くの秘密を知る謎めいた人物。主人公の導き手となる',
    relationships: new Map([
      ['akira', 'mentor'],
      ['ren', 'rival'],
      ['sora', 'complex']
    ]),
    specialAbilities: ['深い知識', '戦略的思考', '魔法の知識']
  },
  {
    id: 'hiroto',
    name: 'ヒロト',
    role: 'ally',
    personality: {
      courage: 80,
      kindness: 85,
      intelligence: 65,
      humor: 90,
      loyalty: 95,
      ambition: 55,
      mystery: 30
    },
    visualDescription: '茶色の髪、人懐っこい笑顔、活発な印象',
    voiceStyle: '明るく元気、時々熱血',
    backgroundStory: '主人公の親友。いつも支えになってくれる頼もしい存在',
    relationships: new Map([
      ['akira', 'ally'],
      ['kaede', 'romantic'],
      ['sora', 'ally']
    ]),
    specialAbilities: ['体力', '仲間思い', '場の空気を読む力']
  },
  {
    id: 'kaede',
    name: 'カエデ',
    role: 'comic_relief',
    personality: {
      courage: 50,
      kindness: 80,
      intelligence: 85,
      humor: 95,
      loyalty: 75,
      ambition: 45,
      mystery: 35
    },
    visualDescription: '赤毛、くりくりした瞳、いつも笑顔',
    voiceStyle: 'コロコロとした可愛らしい声、関西弁',
    backgroundStory: 'ムードメーカーで皆に愛されている。実は頭が良い',
    relationships: new Map([
      ['hiroto', 'romantic'],
      ['yuki', 'ally'],
      ['sora', 'ally']
    ]),
    specialAbilities: ['場を和ませる', '鋭い観察力', '料理上手']
  },
  {
    id: 'ren',
    name: 'レン',
    role: 'rival',
    personality: {
      courage: 95,
      kindness: 40,
      intelligence: 90,
      humor: 30,
      loyalty: 60,
      ambition: 95,
      mystery: 75
    },
    visualDescription: '金髪、冷たい瞳、高貴な雰囲気',
    voiceStyle: '冷徹で高圧的、時に挑発的',
    backgroundStory: '主人公のライバル。実力も高いが、過去に深い傷を負っている',
    relationships: new Map([
      ['akira', 'rival'],
      ['rei', 'rival'],
      ['yuki', 'complex']
    ]),
    specialAbilities: ['高い戦闘力', 'プライド', '完璧主義']
  },
  {
    id: 'sora',
    name: 'ソラ',
    role: 'mysterious',
    personality: {
      courage: 70,
      kindness: 60,
      intelligence: 100,
      humor: 20,
      loyalty: 50,
      ambition: 30,
      mystery: 100
    },
    visualDescription: '紫の髪、異色の瞳、浮世離れした美しさ',
    voiceStyle: '静かで神秘的、時に予言めいた話し方',
    backgroundStory: '謎に包まれた存在。重要な秘密を知っているが、真意は不明',
    relationships: new Map([
      ['rei', 'complex'],
      ['kaede', 'ally'],
      ['hiroto', 'ally']
    ]),
    specialAbilities: ['予知能力', '古い知識', '謎解き']
  }
];

// SSマッチングシステム
export interface SSSession {
  id: string;
  title: string;
  genre: string;
  participants: ParticipantSlot[];
  status: 'recruiting' | 'writing' | 'completed';
  deadline: Date;
  targetLength: number; // 文字数
  theme?: string;
}

export interface ParticipantSlot {
  characterId: string;
  userId?: string;
  isReserved: boolean;
  joinedAt?: Date;
}

// マッチング優先度
export const MATCHING_PRIORITIES = {
  // 必須の組み合わせ（物語に必要）
  essential: [
    ['akira', 'yuki'],      // 主人公 + 恋愛相手
    ['akira', 'rei'],       // 主人公 + 導師
    ['akira', 'hiroto'],    // 主人公 + 親友
  ],
  
  // 面白い組み合わせ
  interesting: [
    ['ren', 'rei'],         // ライバル同士
    ['hiroto', 'kaede'],    // 仲良しコンビ
    ['yuki', 'sora'],       // 神秘的な組み合わせ
  ],
  
  // 避けるべき組み合わせ（相性が悪い）
  avoid: [
    ['ren', 'kaede'],       // 性格が合わない
  ]
} as const;

// SS執筆フロー
export interface SSWritingFlow {
  phase: 'setup' | 'writing' | 'review' | 'complete';
  currentWriter: string;
  writeOrder: string[]; // character ID順
  timeLimit: number; // minutes per turn
  maxLength: number; // characters per turn
}

// 長編統合システム
export interface LongFormIntegration {
  ssCollectionId: string;
  selectedSS: string[]; // 選ばれたSSのID
  integrationPrompt: string; // AI統合用プロンプト
  finalStoryStructure: {
    chapters: Chapter[];
    characterArcs: Map<string, CharacterArc>;
    plotPoints: PlotPoint[];
  };
}

export interface Chapter {
  id: string;
  title: string;
  basedOnSS: string[]; // 元になったSSのID
  characterFocus: string[]; // このチャプターの主要キャラ
  content: string;
}

export interface CharacterArc {
  characterId: string;
  development: {
    beginning: PersonalityTraits;
    middle: PersonalityTraits;
    end: PersonalityTraits;
  };
  keyMoments: string[]; // 重要なシーンのID
}

export interface PlotPoint {
  id: string;
  type: 'introduction' | 'rising_action' | 'climax' | 'falling_action' | 'resolution';
  description: string;
  involvedCharacters: string[];
  sourceSSId?: string;
}