'use client';

import { useState } from 'react';
import { POPULAR_CHARACTERS, FANTASY_TEMPLATES, PRICING_PLANS, LegendCharacter, FantasyGenre, FantasySession } from '../../types/tales-of-legends';

export default function TalesOfLegendsPage() {
  const [selectedCharacter, setSelectedCharacter] = useState<LegendCharacter | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<FantasyGenre>('adventure');
  const [customPrompt, setCustomPrompt] = useState('');
  const [currentSession, setCurrentSession] = useState<FantasySession | null>(null);

  const startFantasy = () => {
    if (!selectedCharacter) return;

    const session: FantasySession = {
      id: `session_${Date.now()}`,
      character: selectedCharacter,
      userPrompt: customPrompt || `${selectedCharacter.name}と一緒に冒険をする`,
      genre: selectedGenre,
      story: [
        {
          id: 'intro',
          text: `あなたは${selectedCharacter.setting}にいる${selectedCharacter.name}と出会いました。\n\n「こんにちは！一緒に${selectedGenre === 'adventure' ? '冒険' : selectedGenre === 'romance' ? 'デート' : '過ごし'}ませんか？」`,
          speaker: 'narrator'
        }
      ]
    };

    setCurrentSession(session);
  };

  if (currentSession) {
    return <FantasyPlayScreen session={currentSession} onBack={() => setCurrentSession(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* ヘッダー */}
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          ✨ Tales of Legends ✨
        </h1>
        <p className="text-xl text-gray-600">
          好きなキャラクターと、あなただけの物語を
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* キャラクター選択 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            💖 誰と過ごしますか？
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {POPULAR_CHARACTERS.map(character => (
              <div
                key={character.id}
                onClick={() => setSelectedCharacter(character)}
                className={`bg-white rounded-2xl p-6 shadow-lg cursor-pointer transition-all hover:scale-105 ${
                  selectedCharacter?.id === character.id ? 'ring-4 ring-purple-300' : ''
                }`}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                  👤
                </div>
                <h3 className="text-xl font-bold text-center mb-2">{character.name}</h3>
                <p className="text-gray-600 text-center text-sm mb-3">{character.personality}</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {character.popularTags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ジャンル選択 */}
        {selectedCharacter && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              🎭 どんな体験をしたいですか？
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {(['adventure', 'romance', 'daily', 'battle', 'mystery'] as FantasyGenre[]).map(genre => {
                const emoji = {
                  adventure: '⚔️',
                  romance: '💕', 
                  daily: '☀️',
                  battle: '🔥',
                  mystery: '🔍'
                }[genre];
                
                const label = {
                  adventure: '冒険',
                  romance: '恋愛',
                  daily: '日常',
                  battle: 'バトル', 
                  mystery: 'ミステリー'
                }[genre];

                return (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`p-4 rounded-xl text-center transition-all ${
                      selectedGenre === genre
                        ? 'bg-purple-500 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 hover:bg-purple-50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{emoji}</div>
                    <div className="font-medium">{label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 妄想テンプレート */}
        {selectedCharacter && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4 text-center">
              💭 こんな体験はいかがですか？
            </h3>
            <div className="grid gap-3">
              {FANTASY_TEMPLATES.find(t => t.genre === selectedGenre)?.templates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => setCustomPrompt(template.replace('{{character}}', selectedCharacter.name))}
                  className="bg-white p-3 rounded-lg text-left hover:bg-purple-50 transition-colors border border-gray-200"
                >
                  {template.replace('{{character}}', selectedCharacter.name)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* カスタム入力 */}
        {selectedCharacter && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4 text-center">
              ✍️ または、自由に入力してください
            </h3>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={`${selectedCharacter.name}と何をしたいですか？`}
              className="w-full p-4 border rounded-xl resize-none h-24"
            />
          </div>
        )}

        {/* 開始ボタン */}
        {selectedCharacter && (
          <div className="text-center mb-12">
            <button
              onClick={startFantasy}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold px-12 py-4 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
            >
              🚀 物語を始める
            </button>
          </div>
        )}

        {/* 料金プラン */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-center mb-6">💎 プラン</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING_PLANS.map(plan => (
              <div key={plan.name} className={`p-6 rounded-xl border-2 ${
                plan.name === 'プレミアム' ? 'border-purple-300 bg-purple-50' : 'border-gray-200'
              }`}>
                <h3 className="text-xl font-bold text-center mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-center mb-4">
                  {plan.price === 0 ? '無料' : `¥${plan.price}`}
                  {plan.price > 0 && <span className="text-base text-gray-500">/月</span>}
                </div>
                <ul className="text-sm space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.name !== '無料体験' && (
                  <button className={`w-full mt-4 py-2 rounded-lg font-medium ${
                    plan.name === 'プレミアム'
                      ? 'bg-purple-500 text-white hover:bg-purple-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition-colors`}>
                    選択
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// プレイ画面コンポーネント
function FantasyPlayScreen({ session, onBack }: { session: FantasySession, onBack: () => void }) {
  const [choices] = useState([
    { id: '1', text: '積極的に話しかける', emotion: 'brave' as const },
    { id: '2', text: '恥ずかしそうに微笑む', emotion: 'shy' as const },
    { id: '3', text: '冷静に状況を見る', emotion: 'cool' as const }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center mb-6">
          <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
            ← 戻る
          </button>
          <h1 className="text-2xl font-bold text-center flex-1">
            {session.character.name}との物語
          </h1>
        </div>

        {/* キャラクター情報 */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <h2 className="text-xl font-bold">{session.character.name}</h2>
              <p className="text-gray-600">{session.character.personality}</p>
            </div>
          </div>
        </div>

        {/* ストーリー */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-lg">
          <div className="prose max-w-none">
            {session.story.map(segment => (
              <div key={segment.id} className="mb-4">
                <p className="whitespace-pre-wrap">{segment.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 選択肢 */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-center text-gray-700">
            あなたはどうしますか？
          </h3>
          {choices.map(choice => (
            <button
              key={choice.id}
              className="w-full p-4 bg-white rounded-xl text-left hover:bg-purple-50 transition-colors shadow-lg"
            >
              <span className="font-medium">{choice.text}</span>
              <span className="text-sm text-gray-500 ml-2">
                ({choice.emotion === 'brave' ? '勇敢' : choice.emotion === 'shy' ? '恥ずかしがり' : 'クール'})
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}