'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import TimelinePost from '@/components/timeline/TimelinePost';
import { dummyTimelinePosts } from '@/lib/dummy-timeline';
import { getNovelChapters } from '@/lib/novel-chapters';
import { TrendingUp, ArrowUp } from 'lucide-react';

export default function Home() {
  const [selectedNovelId, setSelectedNovelId] = useState<string | null>(null);
  
  const handlePostClick = (postId: string) => {
    const chapters = getNovelChapters(postId);
    if (chapters && chapters.length > 0) {
      setSelectedNovelId(postId);
    }
  };


  // 選択された小説の章を取得
  const selectedChapters = selectedNovelId ? getNovelChapters(selectedNovelId) : null;
  const selectedPost = selectedNovelId ? dummyTimelinePosts.find(p => p.id === selectedNovelId) : null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative">
      <Header onHomeClick={() => setSelectedNovelId(null)} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* タイトルとナビゲーション */}
          <div>
            {!selectedChapters && (
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2 justify-center md:justify-start">
                <TrendingUp className="h-6 w-6 text-purple-400 star-glow" />
                <span>タイムライン</span>
              </h2>
            )}
            
            {selectedChapters && selectedPost ? (
              <div className="max-w-3xl mx-auto">
                <div className="space-y-4">
                  {/* 小説の概要情報 */}
                  <TimelinePost 
                    post={selectedPost}
                    isNovelInfo={true}
                  />
                  
                  {/* 章を表示 */}
                  {selectedChapters.map((chapter, index) => (
                    <div key={chapter.id} id={`chapter-${index}`}>
                      <TimelinePost 
                        post={chapter}
                        isChapter={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // 通常のタイムライン - 3カラムレイアウト（マソンリー風）
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {dummyTimelinePosts.map((post) => (
                  <div key={post.id} className="break-inside-avoid">
                    <TimelinePost 
                      post={post}
                      onClick={() => handlePostClick(post.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* 最上部へ戻るボタン */}
          <div className="mt-12 text-center">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-white/40 text-white rounded-full hover:bg-white/10 hover:border-white/60 transition-all duration-300 hover:-translate-y-1"
            >
              <ArrowUp className="h-5 w-5" />
              <span>最上部へ戻る</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}