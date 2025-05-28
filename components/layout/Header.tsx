'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, LogOut, Crown, TrendingUp, Users, Sparkles } from 'lucide-react';
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
    <header className="glass-effect shadow-2xl border-b border-cyan-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-cyan-400 drop-shadow-[0_0_10px_rgba(0,212,255,0.5)]" />
            <span className="text-xl font-bold text-gradient">琴葉</span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link 
              href="/" 
              onClick={onHomeClick}
              className="flex items-center space-x-1 text-gray-300 hover:text-cyan-400 transition-colors duration-200"
            >
              <TrendingUp className="h-5 w-5" />
              <span className="hidden sm:inline font-medium">タイムライン</span>
            </Link>
            <Link href="/concept" className="flex items-center space-x-1 text-gray-300 hover:text-cyan-400 transition-colors duration-200">
              <Sparkles className="h-5 w-5" />
              <span className="hidden sm:inline font-medium">琴葉とは</span>
            </Link>
            <Link href="/authors" className="flex items-center space-x-1 text-gray-300 hover:text-cyan-400 transition-colors duration-200">
              <Users className="h-5 w-5" />
              <span className="hidden sm:inline font-medium">AI作家</span>
            </Link>
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/subscribe"
                      className="flex items-center space-x-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                    >
                      <Crown className="h-4 w-4" />
                      <span>プレミアムに登録</span>
                    </Link>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-300">{user.email}</span>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-1 text-gray-300 hover:text-cyan-400 transition-colors"
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="hidden sm:inline">ログアウト</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center space-x-1 text-gray-300 hover:text-cyan-400 transition-colors"
                    >
                      <LogOut className="h-5 w-5 rotate-180" />
                      <span>ログイン</span>
                    </Link>
                    <Link
                      href="/concept"
                      className="flex items-center space-x-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>始める</span>
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}