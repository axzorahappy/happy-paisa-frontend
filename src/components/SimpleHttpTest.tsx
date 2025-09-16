import { useState } from 'react';

export default function SimpleHttpTest() {
  const [result, setResult] = useState('Ready for HTTP test');
  const [loading, setLoading] = useState(false);

  const testDirectHttp = async () => {
    try {
      setLoading(true);
      setResult('Testing direct HTTP...');
      
      console.log('🌐 SimpleHttpTest: Testing direct HTTP to Supabase REST API');
      
      // Test direct HTTP connection to Supabase REST API
      const response = await fetch('https://vnbnzyszoibyaruujnok.supabase.co/rest/v1/user_profiles?select=id&limit=1', {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuYm56eXN6b2lieWFydXVqbm9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NzMxODEsImV4cCI6MjA3MzM0OTE4MX0.yYaCKSS6dQgAEw7U-Mgr3_P6yxJi0V-zHIPSa-lf3jE',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuYm56eXN6b2lieWFydXVqbm9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NzMxODEsImV4cCI6MjA3MzM0OTE4MX0.yYaCKSS6dQgAEw7U-Mgr3_P6yxJi0V-zHIPSa-lf3jE',
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        }
      });
      
      console.log('🌐 SimpleHttpTest: Response status:', response.status);
      console.log('🌐 SimpleHttpTest: Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('🌐 SimpleHttpTest: Response data:', data);
      
      setResult(`✅ Direct HTTP success! Got ${data.length} records`);
      
    } catch (error: any) {
      console.error('🌐 SimpleHttpTest: Error:', error);
      setResult(`❌ Direct HTTP failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-purple-900/90 text-white p-4 rounded-lg shadow-lg max-w-sm z-50 border border-white/20">
      <h3 className="font-bold mb-2">🌐 HTTP Test</h3>
      
      <div className="space-y-2">
        <button
          onClick={testDirectHttp}
          disabled={loading}
          className="w-full px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Direct HTTP'}
        </button>
      </div>
      
      <div className="mt-3 text-xs bg-gray-800 p-2 rounded max-h-20 overflow-y-auto">
        {result}
      </div>
    </div>
  );
}