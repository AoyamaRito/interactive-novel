// Tales of Legends - シンプルな妄想体験システム

export interface LegendCharacter {
  id: string;
  name: string;
  type: 'anime' | 'game' | 'novel' | 'original';
  avatar: string;
  personality: string;
  setting: string; // 世界観
  popularTags: string[]; // 人気の妄想タグ
  
  // 購入・コレクション要素
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  price: number; // ジェム価格
  isOwned: boolean;
  unlockedAt?: Date;
  
  // ゲーム要素
  level: number;
  experience: number;
  maxLevel: number;
  specialSkills: CharacterSkill[];
  
  // プレミアム要素
  voiceLines?: string[];
  exclusiveScenarios?: string[];
  customization?: CharacterCustomization;
}

// 超シンプルな体験フロー
export interface FantasySession {
  id: string;
  character: LegendCharacter;
  userPrompt: string; // 「〇〇と一緒に冒険したい」など
  genre: FantasyGenre;
  story: StorySegment[];
  currentChoice?: Choice[];
}

export type FantasyGenre = 
  | 'adventure'   // 冒険
  | 'romance'     // 恋愛
  | 'daily'       // 日常
  | 'battle'      // バトル
  | 'mystery'     // ミステリー

export interface StorySegment {
  id: string;
  text: string;
  speaker: 'narrator' | 'character' | 'user';
  image?: string; // AI生成イラスト
  choices?: Choice[];
}

export interface Choice {
  id: string;
  text: string;
  emotion: 'kind' | 'brave' | 'shy' | 'cool' | 'funny';
}

// 人気キャラクター（プリセット）- モバイルレジェンド風
export const POPULAR_CHARACTERS: LegendCharacter[] = [
  {
    id: 'akira_hero',
    name: 'アキラ（勇者）',
    type: 'original',
    avatar: '/characters/akira.jpg',
    personality: '優しくて強い。困った人を放っておけない性格',
    setting: 'ファンタジー世界の勇者',
    popularTags: ['一緒に冒険', '守ってもらう', 'デート', '特訓'],
    rarity: 'common',
    price: 0, // 初期キャラクターは無料
    isOwned: true,
    level: 1,
    experience: 0,
    maxLevel: 50,
    specialSkills: [
      {
        id: 'leadership',
        name: 'リーダーシップ',
        description: '仲間を励ます力',
        type: 'passive',
        effect: 'ストーリーで勇気ある選択肢が増える'
      }
    ]
  },
  {
    id: 'yuki_mage',
    name: 'ユキ（魔法使い）',
    type: 'original', 
    avatar: '/characters/yuki.jpg',
    personality: '知的で神秘的。でも意外と天然',
    setting: '魔法学園の優等生',
    popularTags: ['魔法を教わる', '図書館デート', '実験手伝い', 'お茶会'],
    rarity: 'rare',
    price: 300,
    isOwned: false,
    level: 1,
    experience: 0,
    maxLevel: 60,
    specialSkills: [
      {
        id: 'magic_knowledge',
        name: '魔法知識',
        description: '古い魔法の知識',
        type: 'active',
        effect: '魔法関連の特別なストーリー展開'
      }
    ],
    voiceLines: ['一緒に魔法を学びましょう', '不思議な力を感じます']
  },
  {
    id: 'ren_prince',
    name: 'レン（王子）',
    type: 'original',
    avatar: '/characters/ren.jpg', 
    personality: 'プライドが高いが心は優しい',
    setting: '王国の第一王子',
    popularTags: ['舞踏会', '王宮見学', '政治談義', '秘密のデート'],
    rarity: 'epic',
    price: 800,
    isOwned: false,
    level: 1,
    experience: 0,
    maxLevel: 70,
    specialSkills: [
      {
        id: 'royal_authority',
        name: '王族の権威',
        description: '王族としての影響力',
        type: 'passive',
        effect: '高級な場所でのストーリーが解放'
      }
    ],
    voiceLines: ['君との時間は特別だ', '王族の責任は重い'],
    exclusiveScenarios: ['王宮での秘密の夜会', '国境での極秘任務']
  },
  {
    id: 'luna_assassin',
    name: 'ルナ（暗殺者）',
    type: 'original',
    avatar: '/characters/luna.jpg',
    personality: 'クールで謎めいているが、内面は情熱的',
    setting: '影の組織の精鋭',
    popularTags: ['危険な任務', '秘密の関係', '夜の街', '格闘訓練'],
    rarity: 'legendary',
    price: 1500,
    isOwned: false,
    level: 1,
    experience: 0,
    maxLevel: 80,
    specialSkills: [
      {
        id: 'shadow_arts',
        name: '影の技',
        description: '暗殺者の特殊技能',
        type: 'active',
        effect: 'スリルある危険なストーリー展開'
      },
      {
        id: 'hidden_emotion',
        name: '隠された感情',
        description: '表に出さない深い愛情',
        type: 'passive',
        effect: '感動的な恋愛展開が可能'
      }
    ],
    voiceLines: ['君だけは特別だ', '危険だが...ついてこい'],
    exclusiveScenarios: ['月夜の屋上での告白', '敵組織への潜入任務'],
    customization: {
      outfits: ['忍者装束', '普段着', 'ドレス'],
      accessories: ['仮面', '手裏剣', 'ネックレス'],
      backgrounds: ['夜の街', '古い神社', '豪華なホテル']
    }
  }
];

// 妄想テンプレート（ユーザーが選びやすい）
export const FANTASY_TEMPLATES = [
  {
    genre: 'adventure' as FantasyGenre,
    templates: [
      '{{character}}と一緒に伝説の宝を探しに行く',
      '{{character}}と二人で危険なダンジョンを攻略する', 
      '{{character}}と新大陸を発見する冒険に出る'
    ]
  },
  {
    genre: 'romance' as FantasyGenre,
    templates: [
      '{{character}}との初デートで緊張してしまう',
      '{{character}}と雨宿りをしながら語り合う',
      '{{character}}と夕日を見ながら告白する'
    ]
  },
  {
    genre: 'daily' as FantasyGenre,
    templates: [
      '{{character}}と一緒に料理を作る',
      '{{character}}と街を散歩して買い物する',
      '{{character}}と図書館で勉強会をする'
    ]
  }
];

// キャラクター購入・ガチャシステム
export interface CharacterSkill {
  id: string;
  name: string;
  description: string;
  type: 'passive' | 'active';
  effect: string; // 物語に与える効果
}

export interface CharacterCustomization {
  outfits: string[];
  accessories: string[];
  backgrounds: string[];
}

export interface GameCurrency {
  gems: number;        // 課金通貨
  coins: number;       // 無料通貨
  tickets: number;     // ガチャチケット
}

export interface GachaSystem {
  id: string;
  name: string;
  type: 'character' | 'outfit' | 'scenario';
  cost: number;        // ジェム
  rateUp?: string[];   // レートアップキャラ
  guarantees: {
    rare: number;      // N回で確定
    epic: number;
    legendary: number;
  };
}

// モバイルレジェンド風の課金パッケージ
export interface PurchasePackage {
  id: string;
  name: string;
  price: number;       // 実際の価格（円）
  gems: number;
  bonus?: {
    extraGems?: number;
    tickets?: number;
    exclusiveCharacter?: string;
  };
  isPopular?: boolean;
  discountPercent?: number;
}

export const PURCHASE_PACKAGES: PurchasePackage[] = [
  {
    id: 'starter',
    name: 'スターターパック',
    price: 120,
    gems: 100,
    bonus: {
      tickets: 1
    }
  },
  {
    id: 'monthly',
    name: '月間パス',
    price: 480,
    gems: 500,
    bonus: {
      extraGems: 100,
      tickets: 5
    },
    isPopular: true
  },
  {
    id: 'premium',
    name: 'プレミアムパック',
    price: 980,
    gems: 1200,
    bonus: {
      extraGems: 300,
      tickets: 10,
      exclusiveCharacter: 'special_yuki'
    }
  },
  {
    id: 'mega',
    name: 'メガパック',
    price: 2400,
    gems: 3000,
    bonus: {
      extraGems: 1000,
      tickets: 20
    },
    discountPercent: 25
  }
];

export const GACHA_RATES = {
  character: {
    common: 0.70,    // 70%
    rare: 0.25,      // 25%
    epic: 0.04,      // 4%
    legendary: 0.01  // 1%
  }
};