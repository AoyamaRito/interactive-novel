'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { 
  Send, 
  Sparkles, 
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
import { ExpandableImage } from '@/components/ImageModal';
import type { EntityType } from '@/types/profile';

interface Question {
  id: string;
  text: string;
  field: string;
  type: 'text' | 'select' | 'multiselect';
  options?: string[];
}

const ENTITY_CONFIGS: Record<EntityType, {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  questions: Question[];
}> = {
  character: {
    icon: Users,
    label: 'キャラクター',
    questions: [
      { id: 'name', text: 'キャラクターの名前を教えてください', field: 'display_name', type: 'text' },
      { id: 'money_request', text: '突然知らない人に1000円借りたいと言われたら、このキャラクターはどうしますか？', field: 'metadata.money_reaction', type: 'text' },
      { id: 'lost_item', text: '道で財布を拾ったとき、このキャラクターは最初に何をしますか？', field: 'metadata.lost_item_reaction', type: 'text' },
      { id: 'fear', text: 'このキャラクターが最も恐れていることは何ですか？', field: 'metadata.greatest_fear', type: 'text' },
      { id: 'dream', text: '叶うなら何でも願いを1つ叶えてもらえるとしたら、何を願いますか？', field: 'metadata.ultimate_wish', type: 'text' },
      { id: 'conflict', text: '親友と恋人が喧嘩したとき、このキャラクターはどちら側につきますか？その理由は？', field: 'metadata.conflict_resolution', type: 'text' },
      { id: 'background', text: '最後に、このキャラクターの基本的な設定や背景を教えてください', field: 'bio', type: 'text' },
    ],
  },
  organization: {
    icon: Building2,
    label: '組織',
    questions: [
      { id: 'name', text: '組織の名前を教えてください', field: 'display_name', type: 'text' },
      { id: 'scandal', text: 'この組織で大きなスキャンダルが発覚したとき、組織はどう対応しますか？', field: 'metadata.crisis_response', type: 'text' },
      { id: 'new_member', text: '新しいメンバーが加入するとき、最初に何をさせられますか？', field: 'metadata.initiation', type: 'text' },
      { id: 'forbidden', text: 'この組織で絶対にやってはいけないことは何ですか？', field: 'metadata.taboo', type: 'text' },
      { id: 'rival', text: 'ライバル組織との関係はどのようなものですか？', field: 'metadata.rival_relationship', type: 'text' },
      { id: 'secret', text: 'この組織が隠している秘密や裏の顔はありますか？', field: 'metadata.hidden_agenda', type: 'text' },
      { id: 'description', text: '最後に、この組織の基本的な概要を教えてください', field: 'bio', type: 'text' },
    ],
  },
  world: {
    icon: Globe,
    label: 'ワールド',
    questions: [
      { id: 'name', text: 'ワールドの名前を教えてください', field: 'display_name', type: 'text' },
      { id: 'curse', text: 'この世界にかけられた呪いや制約はありますか？', field: 'metadata.world_curse', type: 'text' },
      { id: 'weather_disaster', text: 'この世界で最も危険な自然現象や災害は何ですか？', field: 'metadata.natural_disaster', type: 'text' },
      { id: 'forbidden_place', text: '絶対に立ち入ってはいけない場所がありますか？なぜですか？', field: 'metadata.forbidden_zone', type: 'text' },
      { id: 'legend', text: 'この世界で語り継がれている伝説や噂は何ですか？', field: 'metadata.legend', type: 'text' },
      { id: 'survival_rule', text: 'この世界で生き残るために知っておくべき重要なルールは何ですか？', field: 'metadata.survival_rule', type: 'text' },
      { id: 'history', text: '最後に、この世界の基本的な設定や歴史を教えてください', field: 'bio', type: 'text' },
    ],
  },
  item: {
    icon: Package,
    label: 'アイテム',
    questions: [
      { id: 'name', text: 'アイテムの名前を教えてください', field: 'display_name', type: 'text' },
      { id: 'side_effect', text: 'このアイテムを使うと起こる予想外の副作用は何ですか？', field: 'metadata.side_effect', type: 'text' },
      { id: 'activation', text: 'このアイテムの力を発動させるには何が必要ですか？', field: 'metadata.activation_method', type: 'text' },
      { id: 'price', text: 'このアイテムを手に入れるために支払った（または支払うべき）代償は何ですか？', field: 'metadata.price_paid', type: 'text' },
      { id: 'previous_owner', text: '前の持ち主はなぜこのアイテムを手放したのですか？', field: 'metadata.previous_owner', type: 'text' },
      { id: 'weakness', text: 'このアイテムの弱点や制限は何ですか？', field: 'metadata.weakness', type: 'text' },
      { id: 'description', text: '最後に、このアイテムの基本的な概要を教えてください', field: 'bio', type: 'text' },
    ],
  },
  event: {
    icon: Calendar,
    label: 'イベント',
    questions: [
      { id: 'name', text: 'イベントの名前を教えてください', field: 'display_name', type: 'text' },
      { id: 'trigger', text: 'このイベントのきっかけとなった些細な出来事は何ですか？', field: 'metadata.trigger_event', type: 'text' },
      { id: 'mistake', text: 'このイベント中に誰かが犯した重大な判断ミスは何ですか？', field: 'metadata.critical_mistake', type: 'text' },
      { id: 'unsung_hero', text: '歴史に名前が残らなかった無名の英雄は誰ですか？何をしましたか？', field: 'metadata.unsung_hero', type: 'text' },
      { id: 'conspiracy', text: 'このイベントに関する陰謀論や裏話はありますか？', field: 'metadata.conspiracy', type: 'text' },
      { id: 'aftermath', text: '10年後、このイベントは人々にどう語り継がれていますか？', field: 'metadata.legacy', type: 'text' },
      { id: 'description', text: '最後に、このイベントの基本的な概要を教えてください', field: 'bio', type: 'text' },
    ],
  },
  concept: {
    icon: Lightbulb,
    label: '概念',
    questions: [
      { id: 'name', text: '概念の名前を教えてください', field: 'display_name', type: 'text' },
      { id: 'opposite', text: 'この概念の正反対にあるものは何ですか？', field: 'metadata.opposite_concept', type: 'text' },
      { id: 'misunderstanding', text: 'この概念について最もよくある誤解は何ですか？', field: 'metadata.common_misconception', type: 'text' },
      { id: 'danger', text: 'この概念を悪用するとどんな危険がありますか？', field: 'metadata.potential_danger', type: 'text' },
      { id: 'evolution', text: '100年後、この概念はどのように変化していると思いますか？', field: 'metadata.future_evolution', type: 'text' },
      { id: 'symbol', text: 'この概念を象徴する色、形、音はありますか？', field: 'metadata.symbolic_representation', type: 'text' },
      { id: 'description', text: '最後に、この概念の基本的な説明をお願いします', field: 'bio', type: 'text' },
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
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Auto-scroll to bottom when chat history changes
  useEffect(() => {
    if (chatContainerRef.current) {
      // Add a small delay to ensure DOM is updated
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [chatHistory]);

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
        // Generate the image prompt based on collected information
        const autoPrompt = generateImagePrompt(selectedType, { ...answers, [currentQuestion.field]: inputValue });
        setGeneratedPrompt(autoPrompt);
        
        setChatHistory(prev => [...prev, 
          { type: 'bot', text: '素晴らしい！すべての情報が揃いました。' },
          { type: 'bot', text: selectedType === 'character' ? 'アバター画像を生成しますか？' : '画像を生成しますか？' }
        ]);
        setShowAvatarGenerator(true);
      }, 500);
    }
  };

  const generateImagePrompt = (entityType: EntityType, answers: Record<string, string>): string => {
    switch (entityType) {
      case 'character':
        const name = answers['display_name'] || '';
        const moneyReaction = answers['metadata.money_reaction'] || '';
        const fear = answers['metadata.greatest_fear'] || '';
        
        let prompt = `${name}, `;
        
        // 行動パターンから性格を推測してプロンプトに反映
        if (moneyReaction.includes('貸す') || moneyReaction.includes('あげる')) {
          prompt += '優しくて思いやりのある, ';
        } else if (moneyReaction.includes('断る') || moneyReaction.includes('警戒')) {
          prompt += '慎重で賢明な, ';
        }
        
        if (fear.includes('孤独') || fear.includes('一人')) {
          prompt += '社交的な, ';
        } else if (fear.includes('失敗') || fear.includes('間違い')) {
          prompt += '完璧主義な, ';
        }
        
        prompt += 'キャラクター';
        return prompt;
        
      case 'organization':
        const orgName = answers['display_name'] || '';
        const crisisResponse = answers['metadata.crisis_response'] || '';
        const secret = answers['metadata.hidden_agenda'] || '';
        
        let orgPrompt = `${orgName}, `;
        
        if (crisisResponse.includes('隠蔽') || crisisResponse.includes('秘密')) {
          orgPrompt += '秘密主義の, ';
        } else if (crisisResponse.includes('公開') || crisisResponse.includes('謝罪')) {
          orgPrompt += '透明性のある, ';
        }
        
        if (secret && secret !== 'ない') {
          orgPrompt += 'ミステリアスな, ';
        }
        
        orgPrompt += '組織のエンブレムやシンボル';
        return orgPrompt;
        
      case 'world':
        const worldName = answers['display_name'] || '';
        const curse = answers['metadata.world_curse'] || '';
        const disaster = answers['metadata.natural_disaster'] || '';
        const forbiddenPlace = answers['metadata.forbidden_zone'] || '';
        
        let worldPrompt = `${worldName}, `;
        
        if (curse && curse !== 'ない') {
          worldPrompt += '呪われた, ';
        }
        
        if (disaster.includes('嵐') || disaster.includes('雷')) {
          worldPrompt += '嵐の多い, ';
        } else if (disaster.includes('火山') || disaster.includes('溶岩')) {
          worldPrompt += '火山のある, ';
        }
        
        if (forbiddenPlace && forbiddenPlace !== 'ない') {
          worldPrompt += '危険な秘密の場所がある, ';
        }
        
        worldPrompt += 'ファンタジー世界の風景';
        return worldPrompt;
        
      case 'item':
        const itemName = answers['display_name'] || '';
        const sideEffect = answers['metadata.side_effect'] || '';
        const weakness = answers['metadata.weakness'] || '';
        const price = answers['metadata.price_paid'] || '';
        
        let itemPrompt = `${itemName}, `;
        
        if (sideEffect.includes('闇') || sideEffect.includes('呪い')) {
          itemPrompt += '不吉な, ';
        } else if (sideEffect.includes('光') || sideEffect.includes('輝く')) {
          itemPrompt += '神聖な, ';
        }
        
        if (price.includes('血') || price.includes('命') || price.includes('魂')) {
          itemPrompt += '禁忌の, ';
        }
        
        if (weakness && weakness !== 'ない') {
          itemPrompt += '古く傷ついた, ';
        }
        
        itemPrompt += '魔法的なアイテム';
        return itemPrompt;
        
      case 'event':
        const eventName = answers['display_name'] || '';
        const mistake = answers['metadata.critical_mistake'] || '';
        const conspiracy = answers['metadata.conspiracy'] || '';
        
        let eventPrompt = `${eventName}, `;
        
        if (mistake.includes('裏切り') || mistake.includes('背信')) {
          eventPrompt += '裏切りと陰謀の, ';
        } else if (mistake.includes('判断ミス') || mistake.includes('間違い')) {
          eventPrompt += '悲劇的な, ';
        }
        
        if (conspiracy && conspiracy !== 'ない') {
          eventPrompt += '謎に満ちた, ';
        }
        
        eventPrompt += '歴史的な出来事のイラスト';
        return eventPrompt;
        
      case 'concept':
        const conceptName = answers['display_name'] || '';
        const symbol = answers['metadata.symbolic_representation'] || '';
        const danger = answers['metadata.potential_danger'] || '';
        
        let conceptPrompt = `${conceptName}, `;
        
        if (symbol.includes('青') || symbol.includes('冷')) {
          conceptPrompt += '青い, ';
        } else if (symbol.includes('赤') || symbol.includes('暖')) {
          conceptPrompt += '赤い, ';
        } else if (symbol.includes('金') || symbol.includes('光')) {
          conceptPrompt += '金色に輝く, ';
        }
        
        if (danger.includes('破壊') || danger.includes('戦争')) {
          conceptPrompt += '危険で力強い, ';
        }
        
        conceptPrompt += '抽象的な概念の視覚化';
        return conceptPrompt;
        
      default:
        return '';
    }
  };

  const createEntity = async () => {
    if (!selectedType || !user) return;
    
    setIsCreating(true);
    
    // Extract metadata from answers
    const metadata: Record<string, unknown> = {};
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
              
              <div 
                ref={chatContainerRef}
                className="h-96 overflow-y-auto mb-4 space-y-4 scroll-smooth"
              >
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
                      initialPrompt={generatedPrompt}
                      onGenerated={(url) => {
                        setAvatarUrl(url);
                        setChatHistory(prev => [...prev, 
                          { type: 'bot', text: '画像が生成されました！準備ができたら作成ボタンを押してください。' }
                        ]);
                      }}
                    />
                  </div>
                )}
                
                {avatarUrl && avatarUrl !== 'skip' && (
                  <div className="flex justify-center">
                    <ExpandableImage 
                      src={avatarUrl} 
                      alt="Generated Avatar" 
                      previewSize="large"
                    />
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