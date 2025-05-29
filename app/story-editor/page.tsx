'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { FileText, Save, Download, Upload, Sparkles } from 'lucide-react';
import Header from '@/components/layout/Header';

// サンプルYAMLテンプレート
const STORY_TEMPLATE = `# 物語のタイトル
title: "新しい物語"
genre: "ファンタジー"
description: |
  ここに物語の概要を書きます。
  複数行で書くことができます。

# キャラクター設定
characters:
  hero:
    name: "主人公の名前"
    age: 20
    personality: ["勇敢", "正義感が強い"]
    background: |
      主人公の背景設定
    relationships:
      - to: mentor
        type: "師弟関係"
        description: "幼い頃から指導を受けている"

  mentor:
    name: "師匠の名前"
    role: "導き手"
    secret: "実は○○だった"

# 世界設定
world:
  name: "物語の舞台"
  description: |
    世界観の説明
  rules:
    - "魔法が存在する"
    - "古代文明の遺跡がある"

# 重要アイテム
items:
  legendary_sword:
    name: "伝説の剣"
    location: "古代遺跡の最深部"
    power: "魔を断つ力"
    current_owner: null

# プロット構成
plot:
  act1:
    title: "旅立ち"
    events:
      - "平和な日常"
      - "事件の発生"
      - "旅立ちの決意"
  
  act2:
    title: "試練"
    events:
      - "最初の壁"
      - "仲間との出会い"
      - "大きな挫折"
  
  act3:
    title: "決戦"
    events:
      - "最後の準備"
      - "決戦"
      - "新たな始まり"

# メモ・アイデア
notes: |
  - ここに思いついたアイデアを自由に書く
  - 伏線のメモ
  - キャラクターの成長ポイント
`;

export default function StoryEditorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [yamlContent, setYamlContent] = useState(STORY_TEMPLATE);
  const [fileName, setFileName] = useState('my-story.yaml');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // ローカルストレージに自動保存
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (yamlContent !== STORY_TEMPLATE) {
        localStorage.setItem('story-draft', yamlContent);
        localStorage.setItem('story-draft-name', fileName);
        setLastSaved(new Date());
      }
    }, 2000);

    return () => clearTimeout(autoSave);
  }, [yamlContent, fileName]);

  // ローカルストレージから復元
  useEffect(() => {
    const savedContent = localStorage.getItem('story-draft');
    const savedName = localStorage.getItem('story-draft-name');
    if (savedContent) {
      setYamlContent(savedContent);
    }
    if (savedName) {
      setFileName(savedName);
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Supabaseに保存する実装をここに追加
      localStorage.setItem('story-draft', yamlContent);
      localStorage.setItem('story-draft-name', fileName);
      setLastSaved(new Date());
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setYamlContent(content);
        setFileName(file.name);
      };
      reader.readAsText(file);
    }
  };

  const generateWithAI = async () => {
    // AI生成機能の実装
    alert('AI生成機能は準備中です！');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <FileText className="h-8 w-8 text-purple-400" />
              Story Editor (YAML)
            </h1>
            
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="px-3 py-1 bg-gray-800 border border-purple-500/30 rounded text-white text-sm"
                placeholder="filename.yaml"
              />
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSaving ? '保存中...' : '保存'}
              </button>
              
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
              >
                <Download className="h-4 w-4" />
                ダウンロード
              </button>
              
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors cursor-pointer">
                <Upload className="h-4 w-4" />
                アップロード
                <input
                  type="file"
                  accept=".yaml,.yml"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {lastSaved && (
            <p className="text-sm text-purple-300 mb-2">
              最終保存: {lastSaved.toLocaleTimeString()}
            </p>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-purple-500/20 p-4">
                <h2 className="text-lg font-semibold text-purple-300 mb-3">
                  YAMLエディタ
                </h2>
                <textarea
                  value={yamlContent}
                  onChange={(e) => setYamlContent(e.target.value)}
                  className="w-full h-[600px] px-4 py-3 bg-gray-900 border border-purple-500/30 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-purple-500 resize-none"
                  spellCheck={false}
                />
              </div>
            </div>

            <div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-purple-500/20 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-purple-300">
                    プレビュー / AI支援
                  </h2>
                  <button
                    onClick={generateWithAI}
                    className="flex items-center gap-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm text-white transition-colors"
                  >
                    <Sparkles className="h-4 w-4" />
                    AIで拡張
                  </button>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 h-[600px] overflow-y-auto">
                  <div className="prose prose-invert max-w-none">
                    <h3 className="text-purple-300">使い方</h3>
                    <ul className="text-sm text-gray-300 space-y-2">
                      <li>• 左側のエディタでYAML形式で物語の設定を記述</li>
                      <li>• インデントでデータの階層を表現</li>
                      <li>• # でコメントを追加可能</li>
                      <li>• | を使って複数行のテキストを記述</li>
                      <li>• 定期的に自動保存されます</li>
                    </ul>
                    
                    <h3 className="text-purple-300 mt-6">AIとの連携</h3>
                    <p className="text-sm text-gray-300">
                      作成したYAMLデータは、AIに直接渡して物語の生成や
                      キャラクターの会話生成などに活用できます。
                    </p>
                    
                    <h3 className="text-purple-300 mt-6">推奨される構成</h3>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• <code>title</code>: 物語のタイトル</li>
                      <li>• <code>characters</code>: キャラクター設定</li>
                      <li>• <code>world</code>: 世界観設定</li>
                      <li>• <code>plot</code>: プロット構成</li>
                      <li>• <code>relationships</code>: 関係性</li>
                      <li>• <code>timeline</code>: 時系列</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}