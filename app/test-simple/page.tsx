'use client';

import { useState, useEffect } from 'react';

export default function TestSimplePage() {
  const [supabaseStatus, setSupabaseStatus] = useState('checking...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testSupabase = async () => {
      try {
        // 動的インポートでSupabaseクライアントをテスト
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        
        if (supabase) {
          setSupabaseStatus('✅ Supabase client created successfully');
          
          // 簡単な接続テスト
          const { error } = await supabase.from('users').select('count').limit(1);
          if (error) {
            setError(`Database query error: ${error.message}`);
          } else {
            setSupabaseStatus('✅ Supabase connection working');
          }
        } else {
          setSupabaseStatus('❌ Failed to create Supabase client');
        }
      } catch (err) {
        setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setSupabaseStatus('❌ Exception occurred');
      }
    };

    testSupabase();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">🧪 Simple Connection Test</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-semibold mb-2">Supabase Status:</h3>
          <p>{supabaseStatus}</p>
        </div>

        {error && (
          <div className="bg-red-900 p-4 rounded">
            <h3 className="font-semibold mb-2">Error:</h3>
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-semibold mb-2">Environment Check:</h3>
          <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
          <p>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
        </div>
      </div>
    </div>
  );
}