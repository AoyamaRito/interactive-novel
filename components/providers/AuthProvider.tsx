'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

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
  const supabase = createClient();

  useEffect(() => {
    if (!supabase) {
      console.warn('Supabase client not available, skipping auth');
      setLoading(false);
      return;
    }

    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Auth session error:', error);
        } else {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Failed to get session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Failed to set up auth listener:', error);
      setLoading(false);
    }
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}