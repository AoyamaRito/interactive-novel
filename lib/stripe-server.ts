import Stripe from 'stripe';

// サーバーサイド専用のStripeインスタンス
// このファイルはサーバーコンポーネントやAPIルートでのみ使用すること
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
  typescript: true,
});

// 価格設定
export const PRICE_CONFIG = {
  // Stripeダッシュボードで作成した価格IDに置き換えてください
  PREMIUM_MONTHLY: process.env.STRIPE_PRICE_ID || 'price_1234567890', // 月額980円
} as const;

export type PriceId = typeof PRICE_CONFIG[keyof typeof PRICE_CONFIG];