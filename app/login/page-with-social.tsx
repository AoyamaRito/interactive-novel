'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { Mail, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const supabase = createClient();

  const handleSocialLogin = async (provider: 'google' | 'twitter') => {
    setIsLoading(provider);
    setMessage(null);

    if (!supabase) {
      setMessage({ 
        type: 'error', 
        text: 'Supabaseが設定されていません。' 
      });
      setIsLoading(null);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
        setIsLoading(null);
      }
    } catch {
      setMessage({ 
        type: 'error', 
        text: 'エラーが発生しました。' 
      });
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen relative">
      <Header />
      
      <main className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ログイン / 新規登録</h1>
          <p className="text-white/80">
            お好きな方法でログインしてください
          </p>
        </div>

        <div className="space-y-4">
          {/* Google Login */}
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading !== null}
            className="w-full py-3 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
          >
            {isLoading === 'google' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span>Googleでログイン</span>
          </button>

          {/* X (Twitter) Login */}
          <button
            onClick={() => handleSocialLogin('twitter')}
            disabled={isLoading !== null}
            className="w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
          >
            {isLoading === 'twitter' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            )}
            <span>Xでログイン</span>
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#1a1a2e] px-4 text-white/60">または</span>
            </div>
          </div>

          {/* Email Magic Link */}
          <a
            href="/login/email"
            className="w-full py-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-white font-medium rounded-lg hover:from-emerald-500/30 hover:to-cyan-500/30 border border-white/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Mail className="h-5 w-5" />
            <span>メールでログイン</span>
          </a>
        </div>

        {message && (
          <div className={`mt-6 p-4 rounded-lg text-sm ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
              : 'bg-red-500/20 border border-red-500/30 text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        <div className="mt-8 text-center space-y-4">
          <p className="text-white/60 text-sm">
            アカウントを作成することで、利用規約とプライバシーポリシーに同意したものとみなされます
          </p>
          <div className="pt-4 border-t border-white/10">
            <p className="text-emerald-400 text-xs">
              ✓ 無料で全作品が読み放題
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}