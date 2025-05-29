'use client';

import { useState } from 'react';
import { POPULAR_CHARACTERS, PURCHASE_PACKAGES, GameCurrency, LegendCharacter } from '../../types/tales-of-legends';

export default function CharacterShopPage() {
  const [currency, setCurrency] = useState<GameCurrency>({
    gems: 50,      // 初期ジェム
    coins: 1000,   // 初期コイン
    tickets: 0     // 初期チケット
  });
  
  const [selectedTab, setSelectedTab] = useState<'characters' | 'gacha' | 'shop'>('characters');
  const [ownedCharacters, setOwnedCharacters] = useState<string[]>(['akira_hero']);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-300 shadow-blue-100';
      case 'epic': return 'border-purple-300 shadow-purple-100';
      case 'legendary': return 'border-yellow-300 shadow-yellow-100';
      default: return 'border-gray-300';
    }
  };

  const purchaseCharacter = (character: LegendCharacter) => {
    if (currency.gems >= character.price && !ownedCharacters.includes(character.id)) {
      setCurrency(prev => ({ ...prev, gems: prev.gems - character.price }));
      setOwnedCharacters(prev => [...prev, character.id]);
    }
  };

  const isOwned = (characterId: string) => ownedCharacters.includes(characterId);

  const drawGacha = () => {
    if (currency.gems < 150) return; // ガチャ1回150ジェム
    
    setCurrency(prev => ({ ...prev, gems: prev.gems - 150 }));
    
    // 簡単なガチャ抽選
    const rand = Math.random();
    let wonCharacter: LegendCharacter | null = null;
    
    if (rand < 0.01) { // 1% legendary
      wonCharacter = POPULAR_CHARACTERS.find(c => c.rarity === 'legendary' && !isOwned(c.id)) || null;
    } else if (rand < 0.05) { // 4% epic
      wonCharacter = POPULAR_CHARACTERS.find(c => c.rarity === 'epic' && !isOwned(c.id)) || null;
    } else if (rand < 0.30) { // 25% rare
      wonCharacter = POPULAR_CHARACTERS.find(c => c.rarity === 'rare' && !isOwned(c.id)) || null;
    }
    
    if (wonCharacter) {
      setOwnedCharacters(prev => [...prev, wonCharacter!.id]);
      alert(`おめでとうございます！${wonCharacter.name}を獲得しました！`);
    } else {
      // コインやアイテムを付与
      setCurrency(prev => ({ ...prev, coins: prev.coins + 100 }));
      alert('今回はハズレでしたが、コイン100枚を獲得しました！');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-lg p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">🏪 キャラクターショップ</h1>
          
          {/* 通貨表示 */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
              <span className="text-yellow-600">💎</span>
              <span className="font-bold">{currency.gems}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
              <span className="text-gray-600">🪙</span>
              <span className="font-bold">{currency.coins}</span>
            </div>
            <div className="flex items-center gap-2 bg-pink-100 px-3 py-1 rounded-full">
              <span className="text-pink-600">🎫</span>
              <span className="font-bold">{currency.tickets}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* タブ */}
        <div className="flex mb-8 bg-white rounded-lg p-2 shadow-lg">
          {[
            { id: 'characters', label: '👥 キャラクター', emoji: '👥' },
            { id: 'gacha', label: '🎰 ガチャ', emoji: '🎰' },
            { id: 'shop', label: '💰 ジェムショップ', emoji: '💰' }
          ].map((tab: { id: string; label: string; emoji: string }) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as 'characters' | 'gacha' | 'shop')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                selectedTab === tab.id
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-purple-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* キャラクタータブ */}
        {selectedTab === 'characters' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">キャラクターコレクション</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {POPULAR_CHARACTERS.map(character => (
                <div
                  key={character.id}
                  className={`bg-white rounded-2xl p-6 shadow-lg border-2 ${getRarityBorder(character.rarity)} ${
                    isOwned(character.id) ? '' : 'opacity-75'
                  }`}
                >
                  {/* レアリティバッジ */}
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-4 ${getRarityColor(character.rarity)}`}>
                    {character.rarity.toUpperCase()}
                  </div>

                  {/* キャラクター画像エリア */}
                  <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl ${
                    isOwned(character.id) ? 'bg-gradient-to-br from-purple-200 to-pink-200' : 'bg-gray-200'
                  }`}>
                    {isOwned(character.id) ? '👤' : '🔒'}
                  </div>

                  <h3 className="text-xl font-bold text-center mb-2">{character.name}</h3>
                  <p className="text-gray-600 text-center text-sm mb-4">{character.personality}</p>

                  {/* スペシャルスキル */}
                  {character.specialSkills && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">特殊スキル:</h4>
                      {character.specialSkills.map(skill => (
                        <div key={skill.id} className="text-xs bg-gray-50 p-2 rounded mb-1">
                          <span className="font-medium">{skill.name}</span>: {skill.description}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 購入ボタン */}
                  <div className="text-center">
                    {isOwned(character.id) ? (
                      <div className="bg-green-100 text-green-600 py-2 px-4 rounded-lg font-medium">
                        ✓ 所有済み
                      </div>
                    ) : character.price === 0 ? (
                      <div className="bg-gray-100 text-gray-600 py-2 px-4 rounded-lg font-medium">
                        無料キャラクター
                      </div>
                    ) : (
                      <button
                        onClick={() => purchaseCharacter(character)}
                        disabled={currency.gems < character.price}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          currency.gems >= character.price
                            ? 'bg-purple-500 text-white hover:bg-purple-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        💎 {character.price}で購入
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ガチャタブ */}
        {selectedTab === 'gacha' && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">🎰 レジェンドガチャ</h2>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-xl font-bold mb-4">キャラクターガチャ</h3>
              <div className="text-sm text-gray-600 mb-6 space-y-1">
                <div>🌟 レジェンダリー: 1%</div>
                <div>💜 エピック: 4%</div>
                <div>💙 レア: 25%</div>
                <div>⚪ コモン: 70%</div>
              </div>
              
              <button
                onClick={drawGacha}
                disabled={currency.gems < 150}
                className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-colors ${
                  currency.gems >= 150
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                💎 150で1回ガチャ
              </button>
            </div>

            {/* 確率表示 */}
            <div className="bg-white rounded-xl p-6 shadow-lg max-w-2xl mx-auto">
              <h3 className="text-lg font-bold mb-4">排出キャラクター</h3>
              <div className="grid grid-cols-2 gap-4">
                {POPULAR_CHARACTERS.filter(c => c.price > 0).map(character => (
                  <div key={character.id} className={`p-3 rounded-lg border ${getRarityBorder(character.rarity)}`}>
                    <div className={`text-xs px-2 py-1 rounded ${getRarityColor(character.rarity)} mb-2`}>
                      {character.rarity}
                    </div>
                    <div className="font-medium">{character.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ショップタブ */}
        {selectedTab === 'shop' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">💰 ジェムショップ</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PURCHASE_PACKAGES.map(pkg => (
                <div
                  key={pkg.id}
                  className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-transform hover:scale-105 ${
                    pkg.isPopular ? 'border-yellow-300 bg-gradient-to-b from-yellow-50 to-white' : 'border-gray-200'
                  }`}
                >
                  {pkg.isPopular && (
                    <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full text-center mb-3">
                      人気 No.1
                    </div>
                  )}
                  
                  {pkg.discountPercent && (
                    <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full text-center mb-3">
                      {pkg.discountPercent}% OFF
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-center mb-2">{pkg.name}</h3>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-purple-600">¥{pkg.price}</div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span>💎 ジェム</span>
                      <span className="font-bold">{pkg.gems}</span>
                    </div>
                    {pkg.bonus?.extraGems && (
                      <div className="flex justify-between text-green-600">
                        <span>🎁 ボーナス</span>
                        <span className="font-bold">+{pkg.bonus.extraGems}</span>
                      </div>
                    )}
                    {pkg.bonus?.tickets && (
                      <div className="flex justify-between text-pink-600">
                        <span>🎫 チケット</span>
                        <span className="font-bold">{pkg.bonus.tickets}</span>
                      </div>
                    )}
                    {pkg.bonus?.exclusiveCharacter && (
                      <div className="text-yellow-600 text-sm">
                        🌟 限定キャラクター付き
                      </div>
                    )}
                  </div>

                  <button className="w-full bg-purple-500 text-white py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors">
                    購入
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}