export default function SimplePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🎵 琴葉</h1>
        <p className="text-xl mb-8">Simple Test Page</p>
        <div className="space-y-4">
          <p>✅ Next.js is working</p>
          <p>✅ Basic routing is working</p>
          <p>✅ CSS is loading</p>
        </div>
        <div className="mt-8">
          <a href="/" className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}