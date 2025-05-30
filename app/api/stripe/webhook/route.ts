import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';
import { createClient } from '@/lib/supabase/server';
import { getRequiredEnv } from '@/lib/env-validation';

// Webhookの処理を記録（重複処理を防ぐ）
const processedEvents = new Set<string>();

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.warn('Webhook request without signature');
    return NextResponse.json(
      { error: 'Missing stripe signature' },
      { status: 400 }
    );
  }

  try {
    // 環境変数を安全に取得
    const webhookSecret = getRequiredEnv('STRIPE_WEBHOOK_SECRET');
    
    // 署名を検証してイベントを構築
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    // イベントの重複処理を防ぐ
    if (processedEvents.has(event.id)) {
      console.log(`Event ${event.id} already processed`);
      return NextResponse.json({ received: true });
    }
    
    processedEvents.add(event.id);
    
    // 古いイベントIDを定期的にクリア（メモリリーク防止）
    if (processedEvents.size > 1000) {
      const idsToKeep = Array.from(processedEvents).slice(-500);
      processedEvents.clear();
      idsToKeep.forEach(id => processedEvents.add(id));
    }

    const supabase = await createClient();
    if (!supabase) {
      throw new Error('Supabase connection failed');
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // メタデータの検証
        if (!session.metadata?.user_id) {
          console.warn('checkout.session.completed without user_id');
          break;
        }
        
        // UUID形式の検証
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(session.metadata.user_id)) {
          console.error('Invalid user_id format:', session.metadata.user_id);
          break;
        }
        
        // ユーザーのプレミアムステータスを更新
        const { error } = await supabase
          .from('users')
          .update({ 
            is_premium: true,
            stripe_customer_id: session.customer as string,
            updated_at: new Date().toISOString()
          })
          .eq('id', session.metadata.user_id);
          
        if (error) {
          console.error('Failed to update user premium status:', error);
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        // メタデータの検証
        if (!subscription.metadata?.user_id) {
          console.warn('customer.subscription.deleted without user_id');
          break;
        }
        
        // UUID形式の検証
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(subscription.metadata.user_id)) {
          console.error('Invalid user_id format:', subscription.metadata.user_id);
          break;
        }
        
        // プレミアムステータスを無効化
        const { error } = await supabase
          .from('users')
          .update({ 
            is_premium: false,
            updated_at: new Date().toISOString()
          })
          .eq('id', subscription.metadata.user_id);
          
        if (error) {
          console.error('Failed to remove user premium status:', error);
        }

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        
        if (!subscription.metadata?.user_id) {
          console.warn('customer.subscription.updated without user_id');
          break;
        }
        
        // サブスクリプションのステータスに基づいて更新
        const isActive = ['active', 'trialing'].includes(subscription.status);
        
        const { error } = await supabase
          .from('users')
          .update({ 
            is_premium: isActive,
            updated_at: new Date().toISOString()
          })
          .eq('id', subscription.metadata.user_id);
          
        if (error) {
          console.error('Failed to update user subscription status:', error);
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('construct event')) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}