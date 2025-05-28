'use client';

import { useEffect, useState } from 'react';

export default function EnvCheckPage() {
  const [envInfo, setEnvInfo] = useState<any>(null);

  useEffect(() => {
    const info = {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      keyExists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
      nodeEnv: process.env.NODE_ENV
    };
    
    console.log('Direct Environment Check:', info);
    setEnvInfo(info);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">🔍 Environment Variables Check</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-semibold mb-2">Runtime Environment:</h3>
          <pre className="text-sm overflow-x-auto">
            {JSON.stringify(envInfo, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-semibold mb-2">Manual Check:</h3>
          <p>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'MISSING'}</p>
          <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? `Present (${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length} chars)` : 'MISSING'}</p>
          <p>NEXT_PUBLIC_APP_URL: {process.env.NEXT_PUBLIC_APP_URL || 'MISSING'}</p>
        </div>

        <div className="bg-red-900 p-4 rounded">
          <h3 className="font-semibold mb-2">⚠️ Diagnosis:</h3>
          {!process.env.NEXT_PUBLIC_SUPABASE_URL && <p>❌ NEXT_PUBLIC_SUPABASE_URL is missing</p>}
          {!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && <p>❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing</p>}
          {process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && (
            <p>✅ Both environment variables are present</p>
          )}
        </div>
      </div>
    </div>
  );
}