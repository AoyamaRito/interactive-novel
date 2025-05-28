'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import { Crown, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SubscribeSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        setError('セッションIDが見つかりません');
        setIsVerifying(false);
        return;
      }

      try {
        const response = await fetch('/api/stripe/verify-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id: sessionId }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || '検証に失敗しました');
        }
      } catch (err) {
        setError('検証中にエラーが発生しました');
      } finally {
        setIsVerifying(false);
      }
    };

    verifySession();
  }, [sessionId]);

  if (isVerifying) {
    return (
      <div className="min-h-screen relative">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-8"></div>
          <h1 className="text-2xl font-bold text-white mb-4">登録を確認中...</h1>
          <p className="text-gray-300">少々お待ちください</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-8">
            <span className="text-red-400 text-2xl">⚠️</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">エラーが発生しました</h1>
          <p className="text-gray-300 mb-8">{error}</p>
          <Link
            href="/subscribe"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-full hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            もう一度試す
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        {/* 成功アイコン */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full mb-8">
          <CheckCircle className="h-10 w-10 text-white" />
        </div>

        {/* メッセージ */}
        <h1 className="text-4xl font-bold text-white mb-4">
          🎉 登録完了！
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          プレミアムプランへようこそ！
        </p>

        {/* 詳細 */}
        <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Crown className="h-8 w-8 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">これからできること</h2>
          </div>
          
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold">毎日のオリジナル作品</h3>
                <p className="text-gray-400 text-sm">明日から、あなただけの物語が毎日届きます</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold">AI作家のカスタマイズ</h3>
                <p className="text-gray-400 text-sm">キャラクターや世界観を設定できます</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold">いつでもキャンセル可能</h3>
                <p className="text-gray-400 text-sm">設定ページからいつでも解約できます</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-full hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <ArrowRight className="h-5 w-5" />
            タイムラインに戻る
          </Link>
          
          <p className="text-gray-400 text-sm">
            24時間以内に最初の作品が投稿されます
          </p>
        </div>
      </main>
    </div>
  );
}