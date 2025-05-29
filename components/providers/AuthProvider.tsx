'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 動的インポートでSupabaseクライアントを安全に読み込み
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();

        if (!supabase) {
          console.warn('Supabase client not available, running without auth');
          setLoading(false);
          return;
        }

        // セッション取得
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Auth session error:', sessionError);
        } else {
          setUser(session?.user ?? null);
        }

        // 認証状態の変更を監視
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event);
            setUser(session?.user ?? null);
            
            // ユーザーがログインした場合、プロフィールを初期化
            if (event === 'SIGNED_IN' && session?.user) {
              try {
                await fetch('/api/profiles/initialize', {
                  method: 'POST',
                });
              } catch (error) {
                console.error('プロフィール初期化エラー:', error);
              }
            }
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}