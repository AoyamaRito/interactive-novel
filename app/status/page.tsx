import Link from 'next/link';

export default function StatusPage() {
  const timestamp = new Date().toISOString();
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">🚀 App Status</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">✅ Deployment Status</h2>
          <p className="text-green-400">App is running successfully!</p>
          <p className="text-gray-400 text-sm">Build time: {timestamp}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">🔗 Available Pages</h2>
          <ul className="space-y-2">
            <li><Link href="/" className="text-cyan-400 hover:underline">/ - Main Page</Link></li>
            <li><Link href="/simple" className="text-cyan-400 hover:underline">/simple - Basic Test</Link></li>
            <li><Link href="/debug" className="text-cyan-400 hover:underline">/debug - Debug Info</Link></li>
            <li><Link href="/env-check" className="text-cyan-400 hover:underline">/env-check - Environment Check</Link></li>
            <li><Link href="/status" className="text-cyan-400 hover:underline">/status - This Page</Link></li>
          </ul>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">⚙️ Environment</h2>
          <p>NODE_ENV: {process.env.NODE_ENV}</p>
          <p>Build Target: {process.env.NEXT_RUNTIME || 'nodejs'}</p>
        </div>
      </div>
    </div>
  );
}