'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import Header from '@/components/layout/Header';

export default function UserSetupPage() {
  const { user, loading } = useAuth();
  const [setupStatus, setSetupStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSetup = async () => {
    if (!user) {
      setSetupStatus('❌ ログインしてください');
      return;
    }

    setIsLoading(true);
    setSetupStatus('🔄 ユーザーデータを確認中...');

    try {
      const response = await fetch('/api/auth/ensure-user', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setSetupStatus(`✅ ${data.message}`);
        console.log('User data:', data.user);
      } else {
        setSetupStatus(`❌ エラー: ${data.error}`);
      }
    } catch (error) {
      setSetupStatus(`❌ エラー: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <p className="text-white">読み込み中...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-white mb-8">ユーザーセットアップ</h1>
        
        <div className="bg-white/10 border border-white/20 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">現在の状態</h2>
          <div className="space-y-2 text-white/80">
            <p>認証状態: {user ? '✅ ログイン済み' : '❌ 未ログイン'}</p>
            {user && (
              <>
                <p>メール: {user.email}</p>
                <p>ユーザーID: {user.id}</p>
              </>
            )}
          </div>
        </div>

        {user && (
          <div className="bg-white/10 border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">データベース設定</h2>
            <p className="text-white/70 mb-4">
              Supabaseのusersテーブルにユーザーデータを作成します
            </p>
            
            <button
              onClick={handleSetup}
              disabled={isLoading}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? '処理中...' : 'ユーザーデータを作成/確認'}
            </button>

            {setupStatus && (
              <div className="mt-4 p-4 bg-black/30 rounded">
                <p className="text-white">{setupStatus}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 bg-blue-900/30 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-2">情報</h3>
          <p className="text-blue-200 text-sm">
            このページは初回ログイン時に自動的にユーザーデータを作成します。
            通常は自動で処理されますが、エラーが発生した場合は手動で実行できます。
          </p>
        </div>
      </main>
    </div>
  );
}