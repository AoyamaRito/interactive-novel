import Header from '@/components/layout/Header';
import TimelinePost from '@/components/timeline/TimelinePost';
import { dummyTimelinePosts } from '@/lib/dummy-timeline';
import { TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <Header />
      
      <main className="max-w-md mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* メインタイムライン */}
          <div>
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
        </div>
      </main>
    </div>
  );
}