'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { 
  MessageCircle, 
  Send, 
  Sparkles, 
  ChevronRight,
  Globe,
  Users,
  Building2,
  Package,
  Calendar,
  Lightbulb,
  ArrowLeft
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { AvatarGenerator } from '@/components/AvatarGenerator';
import type { EntityType } from '@/types/profile';

interface Question {
  id: string;
  text: string;
  field: string;
  type: 'text' | 'select' | 'multiselect';
  options?: string[];
}

const ENTITY_CONFIGS: Record<EntityType, {
  icon: any;
  label: string;
  questions: Question[];
}> = {
  character: {
    icon: Users,
    label: 'キャラクター',
    questions: [
      { id: 'name', text: 'キャラクターの名前を教えてください', field: 'display_name', type: 'text' },
      { id: 'age', text: '年齢はいくつですか？', field: 'metadata.age', type: 'text' },
      { id: 'personality', text: '性格を教えてください（例：優しい、勇敢、内向的）', field: 'metadata.personality', type: 'text' },
      { id: 'occupation', text: '職業や役割は何ですか？', field: 'metadata.occupation', type: 'text' },
      { id: 'skills', text: '特技や能力を教えてください', field: 'metadata.skills', type: 'text' },
      { id: 'background', text: '生い立ちや背景を教えてください', field: 'bio', type: 'text' },
    ],
  },
  organization: {
    icon: Building2,
    label: '組織',
    questions: [
      { id: 'name', text: '組織の名前を教えてください', field: 'display_name', type: 'text' },
      { id: 'type', text: 'どのような種類の組織ですか？（例：ギルド、企業、軍隊）', field: 'metadata.type', type: 'text' },
      { id: 'size', text: '組織の規模はどれくらいですか？', field: 'metadata.size', type: 'text' },
      { id: 'purpose', text: '組織の目的や理念を教えてください', field: 'metadata.purpose', type: 'text' },
      { id: 'leadership', text: 'リーダーや幹部について教えてください', field: 'metadata.leadership', type: 'text' },
      { id: 'description', text: '組織の詳細な説明をお願いします', field: 'bio', type: 'text' },
    ],
  },
  world: {
    icon: Globe,
    label: 'ワールド',
    questions: [
      { id: 'name', text: 'ワールドの名前を教えてください', field: 'display_name', type: 'text' },
      { id: 'geography', text: '地理や環境について教えてください', field: 'metadata.geography', type: 'text' },
      { id: 'culture', text: '文化や習慣について教えてください', field: 'metadata.culture', type: 'text' },
      { id: 'technology', text: '技術レベルはどの程度ですか？', field: 'metadata.technology_level', type: 'text' },
      { id: 'magic', text: '魔法や特殊な力は存在しますか？', field: 'metadata.physics_rules', type: 'text' },
      { id: 'history', text: '重要な歴史や出来事を教えてください', field: 'bio', type: 'text' },
    ],
  },
  item: {
    icon: Package,
    label: 'アイテム',
    questions: [
      { id: 'name', text: 'アイテムの名前を教えてください', field: 'display_name', type: 'text' },
      { id: 'material', text: '何でできていますか？', field: 'metadata.material', type: 'text' },
      { id: 'rarity', text: 'レアリティや希少性はどの程度ですか？', field: 'metadata.rarity', type: 'text' },
      { id: 'abilities', text: '特殊な能力や効果はありますか？', field: 'metadata.abilities', type: 'text' },
      { id: 'origin', text: '起源や由来を教えてください', field: 'metadata.origin', type: 'text' },
      { id: 'description', text: '詳細な説明をお願いします', field: 'bio', type: 'text' },
    ],
  },
  event: {
    icon: Calendar,
    label: 'イベント',
    questions: [
      { id: 'name', text: 'イベントの名前を教えてください', field: 'display_name', type: 'text' },
      { id: 'date', text: 'いつ起きましたか？', field: 'metadata.date', type: 'text' },
      { id: 'location', text: 'どこで起きましたか？', field: 'metadata.location', type: 'text' },
      { id: 'participants', text: '主要な参加者や関係者を教えてください', field: 'metadata.participants', type: 'text' },
      { id: 'impact', text: 'どのような影響がありましたか？', field: 'metadata.impact', type: 'text' },
      { id: 'description', text: '詳細な経緯を教えてください', field: 'bio', type: 'text' },
    ],
  },
  concept: {
    icon: Lightbulb,
    label: '概念',
    questions: [
      { id: 'name', text: '概念の名前を教えてください', field: 'display_name', type: 'text' },
      { id: 'definition', text: 'どのように定義されますか？', field: 'metadata.definition', type: 'text' },
      { id: 'applications', text: 'どのように使われますか？', field: 'metadata.applications', type: 'text' },
      { id: 'related', text: '関連する概念はありますか？', field: 'metadata.related_concepts', type: 'text' },
      { id: 'origin', text: '起源や由来を教えてください', field: 'metadata.origin', type: 'text' },
      { id: 'description', text: '詳細な説明をお願いします', field: 'bio', type: 'text' },
    ],
  },
};

export default function WorldBuildingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<EntityType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [chatHistory, setChatHistory] = useState<Array<{ type: 'bot' | 'user', text: string }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [showAvatarGenerator, setShowAvatarGenerator] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const startConversation = (type: EntityType) => {
    setSelectedType(type);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setChatHistory([
      { type: 'bot', text: `素晴らしい！${ENTITY_CONFIGS[type].label}を作成しましょう。いくつか質問させていただきます。` },
      { type: 'bot', text: ENTITY_CONFIGS[type].questions[0].text },
    ]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedType) return;

    const currentQuestion = ENTITY_CONFIGS[selectedType].questions[currentQuestionIndex];
    
    // Add user message
    setChatHistory(prev => [...prev, { type: 'user', text: inputValue }]);
    
    // Save answer
    setAnswers(prev => ({ ...prev, [currentQuestion.field]: inputValue }));
    
    // Clear input
    setInputValue('');
    
    // Move to next question or finish
    if (currentQuestionIndex < ENTITY_CONFIGS[selectedType].questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      const nextQuestion = ENTITY_CONFIGS[selectedType].questions[currentQuestionIndex + 1];
      setTimeout(() => {
        setChatHistory(prev => [...prev, 
          { type: 'bot', text: 'ありがとうございます！' },
          { type: 'bot', text: nextQuestion.text }
        ]);
      }, 500);
    } else {
      // All questions answered
      setTimeout(() => {
        setChatHistory(prev => [...prev, 
          { type: 'bot', text: '素晴らしい！すべての情報が揃いました。' },
          { type: 'bot', text: selectedType === 'character' ? 'アバター画像を生成しますか？' : '画像を生成しますか？' }
        ]);
        setShowAvatarGenerator(true);
      }, 500);
    }
  };

  const createEntity = async () => {
    if (!selectedType || !user) return;
    
    setIsCreating(true);
    
    // Extract metadata from answers
    const metadata: Record<string, any> = {};
    let displayName = '';
    let bio = '';
    
    Object.entries(answers).forEach(([field, value]) => {
      if (field === 'display_name') {
        displayName = value;
      } else if (field === 'bio') {
        bio = value;
      } else if (field.startsWith('metadata.')) {
        const metaField = field.replace('metadata.', '');
        metadata[metaField] = value;
      }
    });
    
    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: displayName,
          bio,
          avatar_url: avatarUrl,
          entity_type: selectedType,
          metadata,
          favorite_genres: [],
        }),
      });
      
      if (response.ok) {
        router.push('/profiles');
      }
    } catch (error) {
      console.error('Entity creation error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!selectedType ? (
            // Entity type selection
            <div>
              <h1 className="text-3xl font-bold text-white mb-8 text-center">
                ワールドビルディング
              </h1>
              <p className="text-purple-300 text-center mb-8">
                作成したいエンティティのタイプを選択してください
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(Object.entries(ENTITY_CONFIGS) as [EntityType, typeof ENTITY_CONFIGS[EntityType]][]).map(([type, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={type}
                      onClick={() => startConversation(type)}
                      className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-purple-500/30 hover:border-purple-500/60 transition-all group"
                    >
                      <Icon className="h-12 w-12 text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                      <h3 className="text-white font-medium">{config.label}</h3>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            // Conversation interface
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-purple-500/30 p-6">
              <button
                onClick={() => {
                  setSelectedType(null);
                  setChatHistory([]);
                  setAnswers({});
                }}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                戻る
              </button>
              
              <div className="h-96 overflow-y-auto mb-4 space-y-4">
                {chatHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-200'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                
                {showAvatarGenerator && !avatarUrl && (
                  <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                    <AvatarGenerator
                      onGenerated={(url) => {
                        setAvatarUrl(url);
                        setChatHistory(prev => [...prev, 
                          { type: 'bot', text: '画像が生成されました！準備ができたら作成ボタンを押してください。' }
                        ]);
                      }}
                    />
                  </div>
                )}
                
                {avatarUrl && (
                  <div className="flex justify-center">
                    <img src={avatarUrl} alt="Generated" className="w-32 h-32 rounded-lg" />
                  </div>
                )}
              </div>
              
              {!showAvatarGenerator ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-4 py-2 bg-gray-700 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    placeholder="回答を入力..."
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex justify-center gap-4">
                  {!avatarUrl && (
                    <button
                      onClick={() => setAvatarUrl('skip')}
                      className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                    >
                      画像をスキップ
                    </button>
                  )}
                  {(avatarUrl || avatarUrl === 'skip') && (
                    <button
                      onClick={createEntity}
                      disabled={isCreating}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <Sparkles className="h-5 w-5" />
                      {isCreating ? '作成中...' : '作成する'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}