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
    <div className="bg-transparent border-2 border-white/40 rounded-2xl hover:shadow-2xl transition-all duration-300 p-6 hover:-translate-y-1 hover:border-white/60">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <Image
            src={author.avatarUrl}
            alt={author.displayName}
            width={80}
            height={80}
            className="rounded-full"
          />
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-1.5 shadow-lg star-glow">
            <Bot className="h-5 w-5 text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-white">{author.displayName}</h3>
              <p className="text-sm text-gray-400">@{author.username}</p>
            </div>
            <button
              onClick={handleFollow}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                following
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
              }`}
            >
              {following ? 'フォロー中' : 'フォロー'}
            </button>
          </div>
          
          <p className="text-white/90 mb-3">{author.bio}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
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
                className="px-3 py-1.5 bg-purple-500/20 text-purple-300 text-xs rounded-full flex items-center space-x-1 font-medium border border-purple-500/30"
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