'use client';

import { useEffect, useState } from 'react';
import { getStripePublishableKey } from '@/lib/stripe';
import Header from '@/components/layout/Header';

export default function StripeDebugPage() {
  const [debugInfo, setDebugInfo] = useState<{
    publishableKey: string;
    priceId?: string;
    appUrl?: string;
  } | null>(null);

  useEffect(() => {
    setDebugInfo({
      publishableKey: getStripePublishableKey() ? 'Set' : 'Missing',
      priceId: process.env.STRIPE_PRICE_ID ? 'Set' : 'Missing',
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
    });
  }, []);

  const testStripeInit = async () => {
    try {
      const { loadStripe } = await import('@stripe/stripe-js');
      const key = getStripePublishableKey();
      
      if (!key) {
        alert('Stripe publishable key is missing!');
        return;
      }
      
      const stripe = await loadStripe(key);
      
      if (stripe) {
        alert('✅ Stripe loaded successfully!');
      } else {
        alert('❌ Failed to load Stripe');
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen relative">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-white mb-8">💳 Stripe Debug</h1>
        
        <div className="space-y-6">
          {/* 環境変数チェック */}
          <div className="bg-white/10 border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Environment Variables</h2>
            {debugInfo && (
              <div className="space-y-2 text-white/80">
                <p>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: {debugInfo.publishableKey}</p>
                <p>STRIPE_PRICE_ID: {debugInfo.priceId}</p>
                <p>NEXT_PUBLIC_APP_URL: {debugInfo.appUrl || 'Not set'}</p>
              </div>
            )}
          </div>

          {/* Stripeテスト */}
          <div className="bg-white/10 border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Stripe Test</h2>
            <button
              onClick={testStripeInit}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Test Stripe Initialization
            </button>
          </div>

          {/* よくある問題 */}
          <div className="bg-white/10 border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Common Issues</h2>
            <ul className="space-y-2 text-white/80 text-sm">
              <li>• STRIPE_PRICE_ID is server-side only (not accessible in browser)</li>
              <li>• Check Railway env vars for all Stripe keys</li>
              <li>• Ensure Stripe webhook is configured</li>
              <li>• Test mode keys start with pk_test_ and sk_test_</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}