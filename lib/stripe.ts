import Stripe from 'stripe';

// サーバーサイド用
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
  typescript: true,
});

// クライアントサイド用（Stripeパブリッシャブルキー）
export const getStripePublishableKey = () => {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
};

// 価格設定
export const PRICE_CONFIG = {
  // Stripeダッシュボードで作成した価格IDに置き換えてください
  PREMIUM_MONTHLY: process.env.STRIPE_PRICE_ID || 'price_1234567890', // 月額980円
} as const;

export type PriceId = typeof PRICE_CONFIG[keyof typeof PRICE_CONFIG];