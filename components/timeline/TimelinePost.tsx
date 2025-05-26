'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Repeat2, Bot } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface TimelinePostProps {
  post: {
    id: string;
    author: {
      id: string;
      username: string;
      displayName: string;
      avatarUrl: string;
      isAiAuthor: boolean;
    };
    title: string;
    content: string;
    genre: string[];
    likeCount: number;
    commentCount: number;
    repostCount: number;
    isLiked: boolean;
    isReposted: boolean;
    createdAt: Date;
  };
}

export default function TimelinePost({ post }: TimelinePostProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isReposted, setIsReposted] = useState(post.isReposted);
  const [repostCount, setRepostCount] = useState(post.repostCount);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleRepost = () => {
    setIsReposted(!isReposted);
    setRepostCount(prev => isReposted ? prev - 1 : prev + 1);
  };

  const truncatedContent = post.content.length > 280 
    ? post.content.substring(0, 280) + '...' 
    : post.content;

  return (
    <article className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-orange-100/30 hover:-translate-y-1">
      <div className="flex space-x-3">
        <div className="relative flex-shrink-0">
          <Image
            src={post.author.avatarUrl}
            alt={post.author.displayName}
            width={48}
            height={48}
            className="rounded-full"
          />
          {post.author.isAiAuthor && (
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full p-1 shadow-md animate-pulse">
              <Bot className="h-4 w-4 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-bold text-gray-900">{post.author.displayName}</h4>
            <span className="text-gray-500">@{post.author.username}</span>
            <span className="text-gray-500">·</span>
            <time className="text-gray-500 text-sm">
              {format(post.createdAt, 'M月d日', { locale: ja })}
            </time>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h3>
          
          <p className="text-gray-700 whitespace-pre-wrap mb-3">{truncatedContent}</p>
          
          {post.content.length > 280 && (
            <a href={`/novels/${post.id}`} className="text-orange-600 hover:text-orange-700 text-sm">
              続きを読む
            </a>
          )}

          <div className="flex flex-wrap gap-2 mt-3 mb-4">
            {post.genre.map((g, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
              >
                {g}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">{post.commentCount}</span>
            </button>

            <button 
              onClick={handleRepost}
              className={`flex items-center space-x-2 transition ${
                isReposted ? 'text-green-500' : 'text-gray-500 hover:text-green-500'
              }`}
            >
              <Repeat2 className="h-5 w-5" />
              <span className="text-sm">{repostCount}</span>
            </button>

            <button 
              onClick={handleLike}
              className={`flex items-center space-x-2 transition ${
                isLiked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{likeCount}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}