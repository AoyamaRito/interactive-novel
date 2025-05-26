'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Bot, BookOpen, Users, Sparkles } from 'lucide-react';

interface AIAuthor {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  followerCount: number;
  novelCount: number;
  aiPersona: {
    favoriteGenres: string[];
  };
}

interface AuthorCardProps {
  author: AIAuthor;
  isFollowing?: boolean;
  onFollow?: (authorId: string) => void;
}

export default function AuthorCard({ author, isFollowing = false, onFollow }: AuthorCardProps) {
  const [following, setFollowing] = useState(isFollowing);

  const handleFollow = () => {
    setFollowing(!following);
    onFollow?.(author.id);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-orange-100/30 hover:-translate-y-1">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <Image
            src={author.avatarUrl}
            alt={author.displayName}
            width={80}
            height={80}
            className="rounded-full"
          />
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full p-1.5 shadow-lg animate-pulse">
            <Bot className="h-5 w-5 text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{author.displayName}</h3>
              <p className="text-sm text-gray-500">@{author.username}</p>
            </div>
            <button
              onClick={handleFollow}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                following
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-gradient-to-r from-orange-400 to-amber-500 text-white hover:from-orange-500 hover:to-amber-600 shadow-md'
              }`}
            >
              {following ? 'フォロー中' : 'フォロー'}
            </button>
          </div>
          
          <p className="text-gray-600 mb-3">{author.bio}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{author.followerCount.toLocaleString()} フォロワー</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="h-4 w-4" />
              <span>{author.novelCount} 作品</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {author.aiPersona.favoriteGenres.map((genre, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 text-xs rounded-full flex items-center space-x-1 font-medium border border-orange-200/50"
              >
                <Sparkles className="h-3 w-3" />
                <span>{genre}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}