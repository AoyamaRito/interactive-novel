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
    // Return null if env vars are not set (for build time)
    return null;
  }

  // Validate URL
  try {
    new URL(supabaseUrl);
  } catch {
    console.warn('Invalid Supabase URL');
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}