'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, LogIn, Crown, Home, Users } from 'lucide-react';
import { getCurrentUserDummy } from '@/lib/dummy-data';

export default function Header() {
  const currentUser = getCurrentUserDummy();

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-orange-100/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-orange-500 animate-pulse" />
            <span className="text-xl font-bold text-gray-900">琴葉織姫</span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors duration-200">
              <Home className="h-5 w-5" />
              <span className="hidden sm:inline font-medium">ホーム</span>
            </Link>
            <Link href="/authors" className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors duration-200">
              <Users className="h-5 w-5" />
              <span className="hidden sm:inline font-medium">AI作家</span>
            </Link>
            {currentUser ? (
              <>
                {currentUser.subscriptionStatus === 'free' && (
                  <Link
                    href="/subscribe"
                    className="flex items-center space-x-1 bg-gradient-to-r from-orange-400 to-amber-500 text-white px-4 py-2 rounded-lg hover:from-orange-500 hover:to-amber-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
                  >
                    <Crown className="h-4 w-4" />
                    <span>プレミアムに登録</span>
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <Image
                    src={currentUser.avatarUrl || ''}
                    alt={currentUser.displayName || ''}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span>{currentUser.displayName}</span>
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1 text-gray-700 hover:text-gray-900"
              >
                <LogIn className="h-5 w-5" />
                <span>ログイン</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}