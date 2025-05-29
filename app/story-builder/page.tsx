'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { MessageCircle, FileText, Sparkles, Copy, RefreshCw } from 'lucide-react';
import Header from '@/components/layout/Header';

// 物語の核となる要素を対話で集める
const STORY_QUESTIONS = [
  "どんなジャンルの物語を作りたいですか？（例：ファンタジー、SF、ミステリー）",
  "主人公はどんな人物ですか？名前や特徴を教えてください。",
  "主人公が直面する最大の問題や目標は何ですか？",
  "物語の舞台はどこですか？時代や場所の特徴を教えてください。",
  "主人公を助ける人物や、対立する人物はいますか？",
  "この物語で一番伝えたいことは何ですか？",
];

export default function StoryBuilderPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [storyStructure, setStoryStructure] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{type: 'bot' | 'user', text: string}>>([
    { type: 'bot', text: STORY_QUESTIONS[0] }
  ]);

  const handleSubmit = () => {
    if (!currentAnswer.trim()) return;

    // 回答を保存
    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);
    
    // チャット履歴に追加
    setChatHistory([...chatHistory, 
      { type: 'user', text: currentAnswer },
    ]);

    // 次の質問へ
    if (currentQuestion < STORY_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setChatHistory(prev => [...prev, 
        { type: 'bot', text: STORY_QUESTIONS[currentQuestion + 1] }
      ]);
    } else {
      // 全質問終了 - 構造化
      generateStructure(newAnswers);
    }

    setCurrentAnswer('');
  };

  const generateStructure = (allAnswers: string[]) => {
    setIsProcessing(true);

    // シンプルな構造化テキストを生成
    const structure = `# ${allAnswers[1]}の物語

## ジャンル
${allAnswers[0]}

## 主人公
${allAnswers[1]}

## 核となる対立/目標
${allAnswers[2]}

## 舞台設定
${allAnswers[3]}

## 主要キャラクター
${allAnswers[4]}

## テーマ
${allAnswers[5]}

## 基本プロット案
1. 【導入】${allAnswers[1]}が${allAnswers[3]}で日常を送っている
2. 【事件】${allAnswers[2]}が発生する
3. 【展開】${allAnswers[4]}との出会い/対立
4. 【クライマックス】最大の試練に直面
5. 【結末】${allAnswers[5]}を体現する結末

## AIへの指示例
「上記の設定を元に、第1章の冒頭シーン（500文字程度）を書いてください。${allAnswers[1]}の視点で、${allAnswers[3]}の雰囲気を丁寧に描写してください。」
`;

    setStoryStructure(structure);
    setChatHistory(prev => [...prev, 
      { type: 'bot', text: '素晴らしい！物語の骨組みができました。下の構造化データをコピーして、AIに渡すことができます。' }
    ]);
    setIsProcessing(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(storyStructure);
    alert('コピーしました！');
  };

  const reset = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setCurrentAnswer('');
    setStoryStructure('');
    setChatHistory([{ type: 'bot', text: STORY_QUESTIONS[0] }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <MessageCircle className="h-8 w-8 text-purple-400" />
            Story Builder (対話型)
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 対話エリア */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-purple-500/20 p-6">
              <h2 className="text-xl font-semibold text-purple-300 mb-4">
                物語の設計
              </h2>
              
              <div className="h-96 overflow-y-auto mb-4 space-y-4">
                {chatHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-sm px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-200'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              {currentQuestion < STORY_QUESTIONS.length && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    className="flex-1 px-4 py-2 bg-gray-700 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    placeholder="回答を入力..."
                  />
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
                  >
                    送信
                  </button>
                </div>
              )}

              {storyStructure && (
                <button
                  onClick={reset}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  最初から
                </button>
              )}
            </div>

            {/* 構造化結果 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-purple-500/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-purple-300">
                  構造化データ
                </h2>
                {storyStructure && (
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm text-white transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    コピー
                  </button>
                )}
              </div>

              {!storyStructure ? (
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-gray-400">
                    左の質問に答えると、ここに物語の構造が表示されます
                  </p>
                </div>
              ) : (
                <pre className="bg-gray-900 p-4 rounded text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                  {storyStructure}
                </pre>
              )}

              <div className="mt-6 p-4 bg-purple-900/20 rounded-lg">
                <h3 className="text-purple-300 font-medium mb-2">💡 使い方のヒント</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• 6つの質問に答えるだけで物語の骨組みが完成</li>
                  <li>• 生成されたデータをAIにコピペして詳細を展開</li>
                  <li>• 何度でもやり直し可能</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}