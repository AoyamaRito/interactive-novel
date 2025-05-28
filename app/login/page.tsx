'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Mail, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      if (!supabase) {
        setMessage({ 
          type: 'error', 
          text: 'Supabaseが設定されていません。環境変数を確認してください。' 
        });
        setIsLoading(false);
        return;
      }

      // 本番環境では直接URLを使用
      const redirectUrl = window.location.origin;
      
      console.log('Redirect URL:', `${redirectUrl}/auth/callback`);
      
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
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ログイン / 新規登録</h1>
          <p className="text-white/80">
            メールアドレスを入力すると、マジックリンクが送信されます
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
                <Sparkles className="h-5 w-5" />
                <span>マジックリンクを送信</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-white/60 text-sm">
            パスワードは不要です。メールに送信されるリンクをクリックするだけでログインできます。
          </p>
          <div className="pt-4 border-t border-white/10">
            <p className="text-white/80 text-sm mb-2">
              初めての方も同じ手順で登録できます
            </p>
            <p className="text-emerald-400 text-xs">
              ✓ 無料で全作品が読み放題
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}