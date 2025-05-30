'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { PenSquare, User, Home, Menu, X, LogOut, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    
    checkAuth();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ */}
          <Link 
            href="/" 
            className="text-2xl font-bold text-white hover:opacity-80 transition-opacity"
          >
            AI Platform
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
            >
              <Home className="h-4 w-4" />
              <span>ホーム</span>
            </Link>
            <Link 
              href="/story-creator" 
              className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
            >
              <PenSquare className="h-4 w-4" />
              <span>作成</span>
            </Link>
            {userId ? (
              <>
                <Link 
                  href="/billing" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>料金</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>ログアウト</span>
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>ログイン</span>
              </Link>
            )}
          </nav>

          {/* モバイルメニューボタン */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* モバイルメニュー */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-4">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-300 hover:text-white transition-colors flex items-center space-x-2 px-2 py-1"
            >
              <Home className="h-4 w-4" />
              <span>ホーム</span>
            </Link>
            <Link 
              href="/story-creator" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-300 hover:text-white transition-colors flex items-center space-x-2 px-2 py-1"
            >
              <PenSquare className="h-4 w-4" />
              <span>作成</span>
            </Link>
            {userId ? (
              <>
                <Link 
                  href="/billing" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-300 hover:text-white transition-colors flex items-center space-x-2 px-2 py-1"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>料金</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left text-gray-300 hover:text-white transition-colors flex items-center space-x-2 px-2 py-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>ログアウト</span>
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-gray-300 hover:text-white transition-colors flex items-center space-x-2 px-2 py-1"
              >
                <User className="h-4 w-4" />
                <span>ログイン</span>
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}