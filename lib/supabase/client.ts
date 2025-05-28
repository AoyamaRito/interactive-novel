import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

export function createClient(): SupabaseClient | null {
  // Check if we're in the browser
  if (typeof window === 'undefined') {
    return null;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('Supabase Client Debug:', {
    url: supabaseUrl ? 'Set' : 'Missing',
    key: supabaseAnonKey ? 'Set' : 'Missing',
    urlValue: supabaseUrl
  });

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