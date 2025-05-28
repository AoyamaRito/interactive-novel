export default function DebugPage() {
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'Not set',
    NODE_ENV: process.env.NODE_ENV || 'Not set',
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Debug Information</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Environment Variables:</h2>
        <pre className="bg-gray-800 p-4 rounded overflow-x-auto">
          {JSON.stringify(envVars, null, 2)}
        </pre>

        <h2 className="text-xl font-semibold">Build Info:</h2>
        <div className="bg-gray-800 p-4 rounded">
          <p>Build Time: {new Date().toISOString()}</p>
          <p>Page Type: Server Component</p>
        </div>
      </div>
    </div>
  );
}