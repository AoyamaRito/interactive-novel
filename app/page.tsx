'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import TimelinePost from '@/components/timeline/TimelinePost';
import { dummyTimelinePosts } from '@/lib/dummy-timeline';
import { getNovelChapters } from '@/lib/novel-chapters';
import { TrendingUp } from 'lucide-react';

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

  return (
    <div className="min-h-screen relative">
      <Header onHomeClick={() => setSelectedNovelId(null)} />
      
      <main className="max-w-md mx-auto px-4 py-8">
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
              {selectedChapters && selectedPost ? (
                <>
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
                </>
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