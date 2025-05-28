'use client';

import { SafeAuthProvider, useAuth } from '@/components/providers/SafeAuthProvider';

function AuthStatus() {
  const { user, loading, error } = useAuth();

  if (loading) {
    return <div className="text-yellow-400">🔄 Loading auth...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-900 p-4 rounded">
        <h3 className="font-semibold text-red-300">Authentication Error:</h3>
        <p className="text-red-200">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded">
      <h3 className="font-semibold mb-2">Auth Status:</h3>
      {user ? (
        <div className="text-green-400">
          <p>✅ Logged in as: {user.email}</p>
          <p>User ID: {user.id}</p>
        </div>
      ) : (
        <p className="text-gray-400">No user logged in</p>
      )}
    </div>
  );
}

export default function SafeTestPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">🛡️ Safe Auth Test</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Basic Status:</h2>
          <p className="text-green-400">✅ Page loaded successfully</p>
          <p className="text-green-400">✅ React components working</p>
        </div>

        <SafeAuthProvider>
          <AuthStatus />
        </SafeAuthProvider>

        <div className="bg-blue-900 p-4 rounded">
          <h3 className="font-semibold mb-2">Next Steps:</h3>
          <p>If this page works, the issue is with the main AuthProvider.</p>
          <p>Check browser console for any remaining errors.</p>
        </div>
      </div>
    </div>
  );
}