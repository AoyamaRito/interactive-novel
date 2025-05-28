'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import Header from '@/components/layout/Header';

export default function AuthDebugPage() {
  const { user, loading } = useAuth();
  const [supabaseStatus, setSupabaseStatus] = useState<string>('Checking...');
  const [sessionInfo, setSessionInfo] = useState<{
    error?: string;
    hasSession?: boolean;
    user?: string;
    userId?: string;
    expiresAt?: number;
  } | null>(null);

  useEffect(() => {
    const checkSupabase = async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        
        if (!supabase) {
          setSupabaseStatus('❌ Supabase client creation failed');
          return;
        }
        
        setSupabaseStatus('✅ Supabase client created');
        
        // セッション情報を取得
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setSessionInfo({ error: error.message });
        } else {
          setSessionInfo({
            hasSession: !!session,
            user: session?.user?.email,
            userId: session?.user?.id,
            expiresAt: session?.expires_at,
          });
        }
      } catch (error) {
        setSupabaseStatus(`❌ Error: ${error}`);
      }
    };
    
    checkSupabase();
  }, []);

  const handleTestLogin = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      if (!supabase) {
        alert('Supabase client not available');
        return;
      }
      
      const testEmail = prompt('Enter test email:');
      if (!testEmail) return;
      
      const { error } = await supabase.auth.signInWithOtp({
        email: testEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        alert(`Login error: ${error.message}`);
      } else {
        alert('Check your email for the login link!');
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const handleTestLogout = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      if (!supabase) {
        alert('Supabase client not available');
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        alert(`Logout error: ${error.message}`);
      } else {
        alert('Logged out successfully!');
        window.location.reload();
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen relative">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-white mb-8">🔍 認証デバッグ</h1>
        
        <div className="space-y-6">
          {/* AuthProvider状態 */}
          <div className="bg-white/10 border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">AuthProvider Status</h2>
            <div className="space-y-2 text-white/80">
              <p>Loading: {loading ? '⏳ Yes' : '✅ No'}</p>
              <p>User: {user ? `✅ ${user.email}` : '❌ Not logged in'}</p>
              {user && <p>User ID: {user.id}</p>}
            </div>
          </div>

          {/* Supabase直接確認 */}
          <div className="bg-white/10 border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Direct Supabase Check</h2>
            <div className="space-y-2 text-white/80">
              <p>Client Status: {supabaseStatus}</p>
              {sessionInfo && (
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(sessionInfo, null, 2)}
                </pre>
              )}
            </div>
          </div>

          {/* テストアクション */}
          <div className="bg-white/10 border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Test Actions</h2>
            <div className="space-x-4">
              <button
                onClick={handleTestLogin}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                Test Login
              </button>
              <button
                onClick={handleTestLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Test Logout
              </button>
            </div>
          </div>

          {/* デバッグ情報 */}
          <div className="bg-white/10 border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Debug Info</h2>
            <div className="space-y-2 text-white/80 text-sm">
              <p>Origin: {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</p>
              <p>Pathname: {typeof window !== 'undefined' ? window.location.pathname : 'N/A'}</p>
              <p>Auth Callback URL: {typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : 'N/A'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}