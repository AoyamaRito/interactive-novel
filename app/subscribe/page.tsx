'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Header from '@/components/layout/Header';
import { useAuth } from '@/components/providers/AuthProvider';
import { Crown, Check, Sparkles } from 'lucide-react';
import { getStripePublishableKey } from '@/lib/stripe';

// Stripeの初期化
const stripePromise = loadStripe(getStripePublishableKey());

export default function SubscribePage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    console.log('Subscribe button clicked');
    
    if (!user) {
      setError('ログインが必要です');
      console.error('No user logged in');
      return;
    }

    console.log('User found:', user.email);
    setIsLoading(true);
    setError(null);

    try {
      console.log('Creating checkout session...');
      
      // チェックアウトセッションを作成
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          email: user.email,
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      const { sessionId, error: apiError } = data;

      if (apiError) {
        setError(apiError);
        return;
      }

      // Stripeチェックアウトにリダイレクト
      const stripe = await stripePromise;
      if (stripe) {
        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId,
        });

        if (stripeError) {
          setError(stripeError.message || 'エラーが発生しました');
        }
      }
    } catch {
      setError('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen relative">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">ログインが必要です</h1>
          <p className="text-gray-300 mb-8">
            プレミアムプランに登録するには、まずログインしてください。
          </p>
          <a
            href="/login"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-full hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Sparkles className="h-5 w-5" />
            ログインする
          </a>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* ヒーロー */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full mb-6">
            <Crown className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            プレミアムプラン
          </h1>
          <p className="text-xl text-gray-300">
            毎日届く、あなただけのオリジナル物語
          </p>
        </div>

        {/* プラン詳細 */}
        <div className="max-w-2xl mx-auto">
          <div className="border-4 border-cyan-400/60 rounded-3xl p-8 bg-black/20 backdrop-blur-sm shadow-[0_0_30px_rgba(0,212,255,0.3)] relative mb-8">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2 rounded-full text-sm font-bold">
              あなただけの物語
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">月額 ¥980</h2>
              <p className="text-gray-300">税込み</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="h-6 w-6 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-white font-semibold">毎日1作品、あなただけの物語</span>
                  <p className="text-gray-400 text-sm">AI作家があなたの設定に基づいて毎日新作を執筆</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-6 w-6 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-white font-semibold">キャラクター・世界観のカスタマイズ</span>
                  <p className="text-gray-400 text-sm">AI対話でキャラクター履歴書を作成</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-6 w-6 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-white font-semibold">文体・ジャンルの細かい指定</span>
                  <p className="text-gray-400 text-sm">ハードボイルド、ファンタジー、SFなど自由に設定</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-6 w-6 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-white font-semibold">無料プランのすべての機能</span>
                  <p className="text-gray-400 text-sm">全作品の読書・交流機能も引き続き利用可能</p>
                </div>
              </li>
            </ul>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-lg rounded-full hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>処理中...</span>
                </>
              ) : (
                <>
                  <Crown className="h-6 w-6" />
                  <span>プレミアムプランに登録</span>
                </>
              )}
            </button>
          </div>

          {/* 注意事項 */}
          <div className="text-center text-gray-400 text-sm space-y-2">
            <p>• 初回決済は即座に行われます</p>
            <p>• いつでもキャンセル可能です</p>
            <p>• 安全なStripe決済システムを使用</p>
          </div>
        </div>
      </main>
    </div>
  );
}