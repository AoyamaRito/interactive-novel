'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface AvatarGeneratorProps {
  onGenerated: (imageUrl: string) => void;
}

const AVATAR_STYLES = [
  { value: 'アニメ風', label: 'アニメ風' },
  { value: 'リアル', label: 'リアル' },
  { value: 'ファンタジー', label: 'ファンタジー' },
  { value: 'サイバーパンク', label: 'サイバーパンク' },
  { value: '水彩画風', label: '水彩画風' },
  { value: 'ピクセルアート', label: 'ピクセルアート' },
];

const PROMPT_SUGGESTIONS = [
  '青い髪の魔法使い',
  '赤い瞳のエルフ',
  'サイボーグ戦士',
  '花冠をつけた妖精',
  '黒いローブの魔術師',
  '金色の鎧を着た騎士',
];

export function AvatarGenerator({ onGenerated }: AvatarGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('アニメ風');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const generateAvatar = async () => {
    if (!prompt.trim()) {
      setError('説明を入力してください');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/avatar/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'アバターの生成に失敗しました');
      }

      setGeneratedImage(data.imageUrl);
      onGenerated(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-purple-300 mb-2">
          アバターのスタイル
        </label>
        <div className="grid grid-cols-3 gap-2">
          {AVATAR_STYLES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStyle(s.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                style === s.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-purple-300 mb-2">
          アバターの説明
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500"
          rows={3}
          placeholder="例: 青い髪の魔法使い、優しい笑顔"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {PROMPT_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setPrompt(suggestion)}
              className="text-xs px-2 py-1 bg-purple-500/10 text-purple-300 rounded hover:bg-purple-500/20 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {generatedImage && (
        <div className="space-y-2">
          <p className="text-sm text-purple-300">生成されたアバター:</p>
          <img
            src={generatedImage}
            alt="生成されたアバター"
            className="w-32 h-32 rounded-lg mx-auto"
          />
        </div>
      )}

      <button
        onClick={generateAvatar}
        disabled={generating || !prompt.trim()}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {generating ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            生成中...（約20秒）
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            AIでアバターを生成
          </>
        )}
      </button>
    </div>
  );
}