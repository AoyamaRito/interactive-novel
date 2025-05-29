'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { BookOpen, LogOut, Crown, TrendingUp, Users, Sparkles, CreditCard, PenTool } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { ProfileSwitcher } from '@/components/ProfileSwitcher';

interface HeaderProps {
  onHomeClick?: () => void;
}

export default function Header({ onHomeClick }: HeaderProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Logout error:', error);
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

          <nav className="flex items-center space-x-4">
            <Link 
              href="/" 
              onClick={onHomeClick}
              className="text-gray-300 hover:text-cyan-400 transition-colors duration-200"
              title="タイムライン"
            >
              <TrendingUp className="h-5 w-5" />
            </Link>
            <Link 
              href="/concept" 
              className="text-gray-300 hover:text-cyan-400 transition-colors duration-200"
              title="琴葉とは"
            >
              <Sparkles className="h-5 w-5" />
            </Link>
            <Link 
              href="/authors" 
              className="text-gray-300 hover:text-cyan-400 transition-colors duration-200"
              title="AI作家"
            >
              <Users className="h-5 w-5" />
            </Link>
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/subscribe"
                      className="flex items-center space-x-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-3 py-2 rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                    >
                      <Crown className="h-4 w-4" />
                      <span className="hidden md:inline">プレミアム</span>
                    </Link>
                    <Link
                      href="/billing"
                      className="text-gray-300 hover:text-cyan-400 transition-colors duration-200"
                      title="請求"
                    >
                      <CreditCard className="h-5 w-5" />
                    </Link>
                    <Link
                      href="/creative"
                      className="text-gray-300 hover:text-cyan-400 transition-colors duration-200"
                      title="クリエイティブ"
                    >
                      <PenTool className="h-5 w-5" />
                    </Link>
                    <div className="flex items-center space-x-3">
                      {pathname !== '/profiles' && <ProfileSwitcher />}
                      <button
                        onClick={handleLogout}
                        className="text-gray-300 hover:text-cyan-400 transition-colors"
                        title="ログアウト"
                      >
                        <LogOut className="h-5 w-5" />
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