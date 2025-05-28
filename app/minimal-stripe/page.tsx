export default function MinimalStripePage() {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Minimal Stripe Check</h1>
      
      <div className="bg-gray-800 p-6 rounded">
        <h2 className="text-lg font-semibold mb-4">Environment Check:</h2>
        <p>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:</p>
        <p className="font-mono text-sm">
          {publishableKey ? `Set (${publishableKey.substring(0, 15)}...)` : 'NOT SET'}
        </p>
        
        <div className="mt-4">
          <p>Key starts with:</p>
          <p>• pk_test_ = Test mode</p>
          <p>• pk_live_ = Live mode</p>
        </div>
      </div>
      
      <div className="mt-6 bg-blue-800 p-4 rounded">
        <p className="text-sm">
          This is a server component with no client-side JavaScript.
          If this page loads, the basic app is working.
        </p>
      </div>
    </div>
  );
}