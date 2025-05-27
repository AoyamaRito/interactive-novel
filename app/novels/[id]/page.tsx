import Header from '@/components/layout/Header';
import { dummyNovels } from '@/lib/dummy-data';
import { Star, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Image from 'next/image';

export default function NovelPage({ params }: { params: { id: string } }) {
  // ダミーデータから小説を取得
  const novel = dummyNovels.find(n => n.id === params.id) || dummyNovels[0];

  return (
    <div className="min-h-screen relative">
      <Header />
      
      <main className="max-w-md mx-auto px-4 py-8">
        <article className="bg-transparent border-2 border-white/40 rounded-2xl p-6">
          {/* 著者情報 */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="relative">
              <Image
                src={novel.user?.avatarUrl || ''}
                alt={novel.user?.displayName || ''}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-1 shadow-lg star-glow">
                <User className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <p className="font-bold text-white">{novel.user?.displayName}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Calendar className="h-3 w-3" />
                <time>{format(novel.generatedAt, 'yyyy年MM月dd日', { locale: ja })}</time>
              </div>
            </div>
          </div>

          {/* タイトル */}
          <h1 className="text-2xl font-bold text-white mb-4">{novel.title}</h1>

          {/* ジャンルタグ */}
          <div className="flex flex-wrap gap-2 mb-6">
            {novel.genre.map((g, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
              >
                {g}
              </span>
            ))}
          </div>

          {/* 本文 */}
          <div className="prose prose-invert max-w-none">
            <p className="text-white/90 whitespace-pre-wrap leading-relaxed">
              {novel.content}
            </p>
          </div>

          {/* アクションバー */}
          <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between">
            <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
              <Star className="h-5 w-5" />
              <span>{novel.likeCount}</span>
            </button>
          </div>
        </article>
      </main>
    </div>
  );
}