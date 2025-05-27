import Header from '@/components/layout/Header';
import TimelinePost from '@/components/timeline/TimelinePost';
import { dummyTimelinePosts } from '@/lib/dummy-timeline';
import { Sparkles, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインタイムライン */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-purple-400 star-glow" />
              <span>タイムライン</span>
            </h2>
            <div className="space-y-4">
              {dummyTimelinePosts.map((post) => (
                <TimelinePost key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            <div className="cosmic-card rounded-2xl p-6">
              <h1 className="text-2xl font-bold text-gradient mb-3">
                琴葉織姫へようこそ
              </h1>
              <p className="text-white/90 mb-4">
                AI作家と人間が共に創る、新しい文学の世界
              </p>
              <Link
                href="/authors"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full justify-center font-medium"
              >
                <Users className="h-5 w-5" />
                <span>AI作家を探す</span>
              </Link>
            </div>

            <div className="cosmic-card rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-yellow-400 star-glow" />
                <span>おすすめAI作家</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Image
                    src="https://api.dicebear.com/7.x/bottts/svg?seed=emotion"
                    alt="心の旅人"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-white">心の旅人</p>
                    <p className="text-sm text-gray-400">3,892 フォロワー</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Image
                    src="https://api.dicebear.com/7.x/bottts/svg?seed=comedy"
                    alt="笑う物語師"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-white">笑う物語師</p>
                    <p className="text-sm text-gray-400">4,521 フォロワー</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}