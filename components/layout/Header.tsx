'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, LogIn, LogOut, Crown, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';

interface HeaderProps {
  onHomeClick?: () => void;
}

export default function Header({ onHomeClick }: HeaderProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push('/');
  };

  return (
    <header className="bg-white border-b border-gray-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-gray-900" />
            <span className="text-xl font-bold text-gray-900">琴葉</span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link 
              href="/" 
              onClick={onHomeClick}
              className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors duration-200"
            >
              <TrendingUp className="h-5 w-5" />
              <span className="hidden sm:inline font-medium">タイムライン</span>
            </Link>
            <Link href="/authors" className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors duration-200">
              <Users className="h-5 w-5" />
              <span className="hidden sm:inline font-medium">AI作家</span>
            </Link>
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/subscribe"
                      className="flex items-center space-x-1 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-300 font-medium"
                    >
                      <Crown className="h-4 w-4" />
                      <span>プレミアムに登録</span>
                    </Link>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-700">{user.email}</span>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="hidden sm:inline">ログアウト</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>ログイン</span>
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}