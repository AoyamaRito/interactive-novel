import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

export function createClient(): SupabaseClient | null {
  // Check if we're in the browser
  if (typeof window === 'undefined') {
    return null;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Missing Supabase environment variables');
    }
    return null;
  }

  // Validate URL
  try {
    new URL(supabaseUrl);
  } catch {
    if (process.env.NODE_ENV === 'development') {
      console.error('Invalid Supabase URL');
    }
    return null;
  }

  try {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  } catch {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to create Supabase client');
    }
    return null;
  }
}