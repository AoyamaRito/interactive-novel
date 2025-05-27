'use client';

import { useState } from 'react';
import { Star, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Novel } from '@/types';

interface NovelCardProps {
  novel: Novel;
  onLike?: (novelId: string) => void;
}

export default function NovelCard({ novel, onLike }: NovelCardProps) {
  const [isLiked, setIsLiked] = useState(novel.isLikedByUser || false);
  const [likeCount, setLikeCount] = useState(novel.likeCount || 0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.(novel.id);
  };

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{novel.title}</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{novel.user?.displayName}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{format(novel.generatedAt, 'yyyy年MM月dd日', { locale: ja })}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {novel.genre.map((g, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
            >
              {g}
            </span>
          ))}
        </div>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3">
        {novel.summary || novel.content.substring(0, 100) + '...'}
      </p>

      <div className="flex items-center justify-between">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
            isLiked
              ? 'bg-transparent border-2 border-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]'
              : 'bg-transparent border-2 border-gray-400 text-gray-400 hover:border-white hover:text-white'
          }`}
        >
          <Star className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          <span>{likeCount}</span>
        </button>

        <a
          href={`/novels/${novel.id}`}
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          続きを読む →
        </a>
      </div>
    </article>
  );
}