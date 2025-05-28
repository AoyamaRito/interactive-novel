'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Mail, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function EmailLoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const supabase = createClient();

  // 前回のメールアドレスを読み込む
  useEffect(() => {
    const savedEmail = localStorage.getItem('kotoha-email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (!supabase) {
      setMessage({ 
        type: 'error', 
        text: 'Supabaseが設定されていません。環境変数を確認してください。' 
      });
      setIsLoading(false);
      return;
    }

    try {
      const redirectUrl = window.location.origin;
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${redirectUrl}/auth/callback`,
        },
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        // メールアドレスを保存
        localStorage.setItem('kotoha-email', email);
        
        setMessage({ 
          type: 'success', 
          text: 'マジックリンクを送信しました！メールをご確認ください。' 
        });
      }
    } catch {
      setMessage({ 
        type: 'error', 
        text: 'エラーが発生しました。もう一度お試しください。' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <Header />
      
      <main className="max-w-md mx-auto px-4 py-16">
        <div className="mb-8">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>戻る</span>
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">メールでログイン</h1>
          <p className="text-white/80">
            メールアドレスにログインリンクを送信します
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
            />
          </div>

          {message && (
            <div className={`p-4 rounded-lg text-sm ${
              message.type === 'success' 
                ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
                : 'bg-red-500/20 border border-red-500/30 text-red-300'
            }`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>送信中...</span>
              </>
            ) : (
              <>
                <Mail className="h-5 w-5" />
                <span>マジックリンクを送信</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-white/60 text-sm">
            パスワードは不要です。メールに送信されるリンクをクリックするだけでログインできます。
          </p>
        </div>
      </main>
    </div>
  );
}