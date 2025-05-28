import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

export function createClient(): SupabaseClient | null {
  // Check if we're in the browser
  if (typeof window === 'undefined') {
    return null;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('=== Supabase Client Debug ===');
  console.log('URL Status:', supabaseUrl ? 'Set' : 'Missing');
  console.log('Key Status:', supabaseAnonKey ? 'Set' : 'Missing');
  console.log('URL Value:', supabaseUrl);
  console.log('Key Length:', supabaseAnonKey ? supabaseAnonKey.length : 0);
  console.log('================================');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:', {
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? 'Set' : 'Missing'
    });
    return null;
  }

  // Validate URL
  try {
    new URL(supabaseUrl);
  } catch (error) {
    console.error('Invalid Supabase URL:', supabaseUrl, error);
    return null;
  }

  try {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
}