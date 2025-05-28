'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/components/providers/AuthProvider';
import { Crown, CreditCard, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

interface Subscription {
  id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  plan_id: string;
  stripe_subscription_id: string;
}

export default function BillingPage() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSubscription = useCallback(async () => {
    try {
      const response = await fetch('/api/stripe/subscription', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user?.id}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user, fetchSubscription]);

  const handleCancelSubscription = async () => {
    if (!subscription || !confirm('本当にプレミアムプランをキャンセルしますか？')) {
      return;
    }

    setActionLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`,
        },
        body: JSON.stringify({
          subscription_id: subscription.stripe_subscription_id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'プレミアムプランをキャンセルしました。次回更新日まで利用可能です。' });
        await fetchSubscription();
      } else {
        setMessage({ type: 'error', text: data.error || 'キャンセルに失敗しました' });
      }
    } catch {
      setMessage({ type: 'error', text: 'エラーが発生しました' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setActionLoading(true);

    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = data.url;
      } else {
        setMessage({ type: 'error', text: data.error || '請求ポータルの作成に失敗しました' });
      }
    } catch {
      setMessage({ type: 'error', text: 'エラーが発生しました' });
    } finally {
      setActionLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen relative">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">ログインが必要です</h1>
          <a href="/login" className="text-cyan-400 hover:text-cyan-300">
            ログインページへ
          </a>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-white/70 mt-4">読み込み中...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full mb-4">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">請求・プラン管理</h1>
          <p className="text-white/70">サブスクリプションと請求情報の管理</p>
        </div>

        {message && (
          <div className={`mb-8 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
              : 'bg-red-500/20 border border-red-500/30 text-red-300'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {subscription ? (
          <div className="space-y-6">
            {/* 現在のプラン */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="h-6 w-6 text-yellow-400" />
                <h2 className="text-xl font-semibold text-white">プレミアムプラン</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  subscription.status === 'active' 
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {subscription.status === 'active' ? '有効' : '無効'}
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-cyan-400" />
                  <div>
                    <p className="text-white/70 text-sm">開始日</p>
                    <p className="text-white">
                      {new Date(subscription.current_period_start).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-cyan-400" />
                  <div>
                    <p className="text-white/70 text-sm">次回更新日</p>
                    <p className="text-white">
                      {new Date(subscription.current_period_end).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleManageBilling}
                  disabled={actionLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all disabled:opacity-50"
                >
                  {actionLoading ? '処理中...' : '請求情報を管理'}
                </button>
                
                {subscription.status === 'active' && (
                  <button
                    onClick={handleCancelSubscription}
                    disabled={actionLoading}
                    className="flex-1 py-3 bg-red-500/20 border border-red-500/30 text-red-300 font-medium rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50"
                  >
                    {actionLoading ? '処理中...' : 'プランをキャンセル'}
                  </button>
                )}
              </div>
            </div>

            {/* プラン詳細 */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">プラン詳細</h3>
              <div className="space-y-2 text-white/70">
                <p>• 毎日1作品、あなただけのオリジナル物語</p>
                <p>• キャラクター・世界観のカスタマイズ</p>
                <p>• 文体・ジャンルの細かい指定</p>
                <p>• 無料プランのすべての機能</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-white/5 border border-white/10 rounded-lg p-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                プレミアムプランに登録していません
              </h2>
              <p className="text-white/70 mb-6">
                毎日届くあなただけのオリジナル物語を楽しみませんか？
              </p>
              <a
                href="/subscribe"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all"
              >
                <Crown className="h-5 w-5" />
                プレミアムプランを見る
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}