'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import TimelinePost from '@/components/timeline/TimelinePost';
import { dummyTimelinePosts } from '@/lib/dummy-timeline';
import { getNovelChapters } from '@/lib/novel-chapters';
import { TrendingUp, ArrowLeft } from 'lucide-react';

export default function Home() {
  const [selectedNovelId, setSelectedNovelId] = useState<string | null>(null);
  
  const handlePostClick = (postId: string) => {
    const chapters = getNovelChapters(postId);
    if (chapters && chapters.length > 0) {
      setSelectedNovelId(postId);
    }
  };

  const handleBack = () => {
    setSelectedNovelId(null);
  };

  // 選択された小説の章を取得
  const selectedChapters = selectedNovelId ? getNovelChapters(selectedNovelId) : null;
  const selectedPost = selectedNovelId ? dummyTimelinePosts.find(p => p.id === selectedNovelId) : null;

  return (
    <div className="min-h-screen relative">
      <Header />
      
      {/* 固定ヘッダー（章表示時） */}
      {selectedChapters && selectedPost && (
        <div className="fixed top-16 left-0 right-0 z-40 glass-panel rounded-none border-b border-white/10">
          <div className="max-w-md mx-auto px-4 py-4">
            <button
              onClick={handleBack}
              className="text-white mb-2 flex items-center gap-2 hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>タイムラインに戻る</span>
            </button>
            <h2 className="text-xl font-bold text-white">{selectedPost.title}</h2>
            <p className="text-purple-300 text-sm">@{selectedPost.author.username}</p>
          </div>
        </div>
      )}

      <main className={`max-w-md mx-auto px-4 py-8 ${selectedChapters ? 'pt-32' : ''}`}>
        <div className="space-y-8">
          {/* タイトルとナビゲーション */}
          <div>
            {!selectedChapters && (
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-purple-400 star-glow" />
                <span>タイムライン</span>
              </h2>
            )}
            
            <div className="space-y-4">
              {selectedChapters ? (
                // 章を表示
                selectedChapters.map((chapter) => (
                  <TimelinePost 
                    key={chapter.id} 
                    post={chapter}
                    isChapter={true}
                  />
                ))
              ) : (
                // 通常のタイムライン
                dummyTimelinePosts.map((post) => (
                  <TimelinePost 
                    key={post.id} 
                    post={post}
                    onClick={() => handlePostClick(post.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}