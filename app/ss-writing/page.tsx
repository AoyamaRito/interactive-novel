'use client';

import { useState, useEffect } from 'react';
import { PRESET_CHARACTERS, SSSession, ParticipantSlot, SSWritingFlow } from '../../types/seven-character-system';

export default function SSWritingPage() {
  const [currentSession, setCurrentSession] = useState<SSSession | null>(null);
  const [availableSessions, setAvailableSessions] = useState<SSSession[]>([]);
  const [writingFlow, setWritingFlow] = useState<SSWritingFlow | null>(null);
  const [currentText, setCurrentText] = useState('');
  const [storyContent, setStoryContent] = useState<string[]>([]);

  // セッション作成
  const createSession = () => {
    const newSession: SSSession = {
      id: `ss_${Date.now()}`,
      title: '新しいSS共同執筆',
      genre: 'ファンタジー',
      participants: PRESET_CHARACTERS.map(char => ({
        characterId: char.id,
        isReserved: false
      })),
      status: 'recruiting',
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24時間後
      targetLength: 2000
    };
    setAvailableSessions(prev => [...prev, newSession]);
  };

  // キャラクター予約
  const reserveCharacter = (sessionId: string, characterId: string) => {
    setAvailableSessions(prev => 
      prev.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            participants: session.participants.map(p => 
              p.characterId === characterId 
                ? { ...p, isReserved: true, userId: 'current_user', joinedAt: new Date() }
                : p
            )
          };
        }
        return session;
      })
    );
  };

  // 執筆開始
  const startWriting = (session: SSSession) => {
    const reservedParticipants = session.participants.filter(p => p.isReserved);
    const writeOrder = reservedParticipants.map(p => p.characterId);
    
    const flow: SSWritingFlow = {
      phase: 'writing',
      currentWriter: writeOrder[0],
      writeOrder,
      timeLimit: 15, // 15分
      maxLength: 300 // 300文字
    };
    
    setCurrentSession(session);
    setWritingFlow(flow);
    setStoryContent(['']);
  };

  // テキスト投稿
  const submitText = () => {
    if (!writingFlow || !currentText.trim()) return;

    // 現在のテキストを追加
    setStoryContent(prev => [...prev, currentText]);
    setCurrentText('');

    // 次の書き手に移る
    const currentIndex = writingFlow.writeOrder.indexOf(writingFlow.currentWriter);
    const nextIndex = (currentIndex + 1) % writingFlow.writeOrder.length;
    
    setWritingFlow(prev => prev ? {
      ...prev,
      currentWriter: writingFlow.writeOrder[nextIndex]
    } : null);
  };

  const getCurrentCharacter = () => {
    if (!writingFlow) return null;
    return PRESET_CHARACTERS.find(char => char.id === writingFlow.currentWriter);
  };

  const getCharacterById = (id: string) => {
    return PRESET_CHARACTERS.find(char => char.id === id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          📝 SS共同執筆
        </h1>

        {!currentSession ? (
          // セッション選択画面
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-700">参加可能なセッション</h2>
              <button
                onClick={createSession}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                新規セッション作成
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {availableSessions.map(session => (
                <div key={session.id} className="bg-white rounded-lg p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-2">{session.title}</h3>
                  <p className="text-gray-600 mb-4">ジャンル: {session.genre}</p>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {session.participants.map(participant => {
                      const character = getCharacterById(participant.characterId);
                      return (
                        <div
                          key={participant.characterId}
                          className={`p-2 rounded text-center text-sm ${
                            participant.isReserved 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600 cursor-pointer hover:bg-blue-100'
                          }`}
                          onClick={() => !participant.isReserved && reserveCharacter(session.id, participant.characterId)}
                        >
                          <div className="font-medium">{character?.name}</div>
                          <div className="text-xs">{character?.role}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      参加者: {session.participants.filter(p => p.isReserved).length}/7
                    </span>
                    {session.participants.filter(p => p.isReserved).length >= 3 && (
                      <button
                        onClick={() => startWriting(session)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                      >
                        執筆開始
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // 執筆画面
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">{currentSession.title}</h2>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>ジャンル: {currentSession.genre}</span>
                <span>目標文字数: {currentSession.targetLength}文字</span>
                <span>現在: {storyContent.join('').length}文字</span>
              </div>
            </div>

            {/* 参加者表示 */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">参加キャラクター</h3>
              <div className="flex gap-2 flex-wrap">
                {writingFlow?.writeOrder.map(charId => {
                  const character = getCharacterById(charId);
                  const isCurrent = charId === writingFlow.currentWriter;
                  return (
                    <div
                      key={charId}
                      className={`px-3 py-1 rounded-full text-sm ${
                        isCurrent 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {character?.name}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 既存のストーリー */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">物語</h3>
              <div className="bg-gray-50 p-4 rounded-lg max-h-80 overflow-y-auto">
                {storyContent.filter(text => text.trim()).map((text, index) => (
                  <div key={index} className="mb-3 p-3 bg-white rounded border-l-4 border-blue-200">
                    <div className="text-sm text-gray-500 mb-1">
                      {writingFlow && getCharacterById(writingFlow.writeOrder[index % writingFlow.writeOrder.length])?.name}
                    </div>
                    <div className="whitespace-pre-wrap">{text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 現在の書き手 */}
            {writingFlow && getCurrentCharacter() && (
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-3">
                  <h3 className="text-lg font-medium">
                    現在の書き手: {getCurrentCharacter()?.name}
                  </h3>
                  <div className="text-sm text-gray-600">
                    残り時間: {writingFlow.timeLimit}分
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <div className="text-sm text-gray-700 mb-2">
                    <strong>キャラクター情報:</strong> {getCurrentCharacter()?.backgroundStory}
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>話し方:</strong> {getCurrentCharacter()?.voiceStyle}
                  </div>
                </div>

                <textarea
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  placeholder={`${getCurrentCharacter()?.name}として物語を続けてください...`}
                  className="w-full h-32 p-3 border rounded-lg resize-none"
                  maxLength={writingFlow.maxLength}
                />
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">
                    {currentText.length}/{writingFlow.maxLength}文字
                  </span>
                  <button
                    onClick={submitText}
                    disabled={!currentText.trim()}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
                  >
                    投稿
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}