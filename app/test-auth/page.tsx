'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/layout/Header';

export default function TestAuthPage() {
  const [user, setUser] = useState<{id: string; email?: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      }
      setLoading(false);
    };

    checkUser();
  }, [supabase]);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setUser(null);
    }
  };

  return (
    <div className="min-h-screen relative">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-white mb-8">認証状態テスト</h1>
        
        <div className="bg-white/10 border border-white/20 rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">現在の状態:</h2>
            {loading ? (
              <p className="text-white/70">読み込み中...</p>
            ) : user ? (
              <div className="space-y-2">
                <p className="text-green-400">✓ ログイン済み</p>
                <p className="text-white/70">メール: {user.email}</p>
                <p className="text-white/70">ID: {user.id}</p>
                <button
                  onClick={handleSignOut}
                  className="mt-4 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-red-400">✗ ログインしていません</p>
                <a 
                  href="/login" 
                  className="inline-block mt-4 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition-colors"
                >
                  ログインページへ
                </a>
              </div>
            )}
          </div>
          
          <div className="pt-4 border-t border-white/10">
            <h3 className="text-sm font-semibold text-white/80 mb-2">デバッグ情報:</h3>
            <pre className="text-xs text-white/60 overflow-x-auto">
              {JSON.stringify({
                origin: typeof window !== 'undefined' ? window.location.origin : 'N/A',
                href: typeof window !== 'undefined' ? window.location.href : 'N/A',
                env_url: process.env.NEXT_PUBLIC_APP_URL || 'Not set'
              }, null, 2)}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}