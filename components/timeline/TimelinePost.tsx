'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, MessageCircle, Repeat2, Bot } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getNovelChapters } from '@/lib/novel-chapters';

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
    chapterNumber?: number;
    isChapter?: boolean;
  };
  onClick?: () => void;
  isChapter?: boolean;
  isNovelInfo?: boolean;
}

export default function TimelinePost({ post, onClick, isChapter, isNovelInfo }: TimelinePostProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isReposted, setIsReposted] = useState(post.isReposted);
  const [repostCount, setRepostCount] = useState(post.repostCount);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleRepost = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReposted(!isReposted);
    setRepostCount(prev => isReposted ? prev - 1 : prev + 1);
  };

  const truncatedContent = post.content.length > 280 
    ? post.content.substring(0, 280) + '...' 
    : post.content;

  const handleClick = () => {
    if (onClick && !isChapter) {
      onClick();
    }
  };

  if (isNovelInfo) {
    const chapters = getNovelChapters(post.id);
    
    const scrollToChapter = (chapterIndex: number) => {
      const chapterElement = document.getElementById(`chapter-${chapterIndex}`);
      if (chapterElement) {
        chapterElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    
    return (
      <>
        <article className="py-8">
          {/* 作家情報 */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative flex-shrink-0">
              <Image
                src={post.author.avatarUrl}
                alt={post.author.displayName}
                width={48}
                height={48}
                className="rounded-full border border-gray-900"
              />
              {post.author.isAiAuthor && (
                <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-1">
                  <Bot className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{post.author.displayName}</h4>
              <span className="text-gray-600 text-sm">@{post.author.username}</span>
            </div>
          </div>

          {/* タイトル */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h2>
          
          {/* あらすじ */}
          <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.content}</p>
          
          {/* ジャンル */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.genre.map((g, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-300"
              >
                {g}
              </span>
            ))}
          </div>
          
          {/* 目次 */}
          {chapters && chapters.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">目次</h3>
              <div className="space-y-2">
                {chapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    onClick={() => scrollToChapter(index)}
                    className="block w-full text-left text-gray-700 hover:text-gray-900 transition-colors py-1 px-2 rounded hover:bg-gray-50"
                  >
                    {chapter.title}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* アクションボタン */}
          <div className="flex items-center justify-between">
            <button 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">{post.commentCount}</span>
            </button>

            <button 
              onClick={handleRepost}
              className={`flex items-center space-x-2 transition-colors duration-200 ${
                isReposted ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Repeat2 className="h-5 w-5" />
              <span className="text-sm">{repostCount}</span>
            </button>

            <button 
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors duration-200 ${
                isLiked ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Star className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{likeCount}</span>
            </button>
          </div>
        </article>
        
        {/* 太い区切り線 */}
        <div className="border-b-4 border-gray-300 mb-4"></div>
      </>
    );
  }

  if (isChapter) {
    return (
      <>
        <article className="py-8">
          {/* 章タイトル */}
          <h3 className="text-xl font-bold text-gray-900 mb-6">{post.title}</h3>
          
          {/* 本文 */}
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>
          
          {/* アクションボタン */}
          <div className="flex items-center justify-between mt-6">
            <button 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">{post.commentCount}</span>
            </button>

            <button 
              onClick={handleRepost}
              className={`flex items-center space-x-2 transition-colors duration-200 ${
                isReposted ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Repeat2 className="h-5 w-5" />
              <span className="text-sm">{repostCount}</span>
            </button>

            <button 
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors duration-200 ${
                isLiked ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Star className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{likeCount}</span>
            </button>
          </div>
        </article>
        
        {/* 区切り線 */}
        <div className="border-b border-gray-300"></div>
      </>
    );
  }

  return (
    <article 
      className={`bg-transparent border-2 border-gray-300 rounded-2xl hover:shadow-lg transition-all duration-300 p-6 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      {/* 著者情報 */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="relative flex-shrink-0">
          <Image
            src={post.author.avatarUrl}
            alt={post.author.displayName}
            width={40}
            height={40}
            className="rounded-full"
          />
          {post.author.isAiAuthor && (
            <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-1">
              <Bot className="h-3 w-3 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center flex-wrap gap-x-2">
            <h4 className="font-bold text-gray-900">{post.author.displayName}</h4>
            <span className="text-gray-600 text-sm">@{post.author.username}</span>
          </div>
          <time className="text-gray-600 text-xs">
            {format(post.createdAt, 'M月d日', { locale: ja })}
          </time>
        </div>
      </div>

      {/* コンテンツ */}
      <div>

          <h3 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h3>
          
          <p className="text-gray-700 whitespace-pre-wrap mb-3">{truncatedContent}</p>
          
          {post.content.length > 280 && (
            <a href={`/novels/${post.id}`} className="text-gray-700 hover:text-gray-900 text-sm font-medium hover:underline">
              続きを読む →
            </a>
          )}

          <div className="flex flex-wrap gap-2 mt-3 mb-4">
            {post.genre.map((g, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-50 text-gray-700 text-xs rounded-full border border-gray-300"
              >
                {g}
              </span>
            ))}
          </div>

        <div className="flex items-center justify-between">
          <button 
            onClick={(e) => e.stopPropagation()}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm">{post.commentCount}</span>
          </button>

          <button 
            onClick={handleRepost}
            className={`flex items-center space-x-2 transition-colors duration-200 ${
              isReposted ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
            }`}
          >
            <Repeat2 className="h-5 w-5" />
            <span className="text-sm">{repostCount}</span>
          </button>

          <button 
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors duration-200 ${
              isLiked ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Star className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{likeCount}</span>
          </button>
        </div>
      </div>
    </article>
  );
}