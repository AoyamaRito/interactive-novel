import Stripe from 'stripe';

// サーバーサイド専用のStripeインスタンス
// このファイルはサーバーコンポーネントやAPIルートでのみ使用すること

// Stripeクライアントの遅延初期化
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2025-05-28.basil',
      typescript: true,
    });
  }
  return stripeInstance;
}

// 互換性のためのexport
export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    const instance = getStripe();
    return Reflect.get(instance, prop, instance);
  },
});

// 価格設定
export const PRICE_CONFIG = {
  // Stripeダッシュボードで作成した価格IDに置き換えてください
  PREMIUM_MONTHLY: process.env.STRIPE_PRICE_ID || 'price_1234567890', // 月額980円
} as const;

export type PriceId = typeof PRICE_CONFIG[keyof typeof PRICE_CONFIG];