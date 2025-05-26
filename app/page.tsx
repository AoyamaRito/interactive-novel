import Header from '@/components/layout/Header';
import NovelCard from '@/components/novels/NovelCard';
import { dummyNovels } from '@/lib/dummy-data';
import { Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-orange-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AIが紡ぐ、あなただけの物語
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            琴葉織姫は、AIが毎日新しい小説を生成する革新的なプラットフォームです
          </p>
          <div className="flex items-center justify-center space-x-4">
            <a
              href="/subscribe"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-400 to-amber-500 text-white px-6 py-3 rounded-lg hover:from-orange-500 hover:to-amber-600 transition shadow-lg"
            >
              <Sparkles className="h-5 w-5" />
              <span>プレミアム会員になる</span>
            </a>
            <a
              href="/about"
              className="inline-flex items-center text-orange-600 hover:text-orange-700"
            >
              詳しく見る →
            </a>
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">最新の小説</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dummyNovels.map((novel) => (
              <NovelCard key={novel.id} novel={novel} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}