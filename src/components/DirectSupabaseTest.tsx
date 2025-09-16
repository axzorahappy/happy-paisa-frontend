import { useState } from 'react';
import { getSupabase } from '../lib/supabase';

export default function DirectSupabaseTest() {
  const [result, setResult] = useState('Ready for direct testing');
  const [loading, setLoading] = useState(false);

  const testSupabaseClient = async () => {
    try {
      setLoading(true);
      setResult('Testing Supabase client...');
      
      const supabase = getSupabase();
      console.log('🧪 DirectTest: Supabase client:', !!supabase);
      
      if (!supabase) {
        setResult('❌ Supabase client is null - configuration issue!');
        return;
      }
      
      // Test basic connection with a simple query
      console.log('🧪 DirectTest: Testing connection...');
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timed out after 10 seconds')), 10000)
      );
      
      const queryPromise = supabase
        .from('user_profiles')
        .select('id', { count: 'exact', head: true });
      
      const { data, error, count } = await Promise.race([queryPromise, timeoutPromise]) as any;
      
      if (error) {
        setResult(`❌ Supabase connection failed: ${error.message}`);
        console.error('🧪 DirectTest: Connection error:', error);
        return;
      }
      
      setResult(`✅ Supabase working! Found ${count} profiles`);
      console.log('🧪 DirectTest: Connection successful, count:', count);
      
    } catch (error: any) {
      setResult(`❌ Direct test failed: ${error.message}`);
      console.error('🧪 DirectTest: Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testProfileQuery = async () => {
    try {
      setLoading(true);
      setResult('Testing profile query...');
      
      const supabase = getSupabase();
      if (!supabase) {
        setResult('❌ No Supabase client');
        return;
      }
      
      // Direct query for the specific user
      console.log('🧪 DirectTest: Querying profile for abhiseohyd@gmail.com...');
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', 'abhiseohyd@gmail.com')
        .single();
      
      if (error) {
        setResult(`❌ Profile query failed: ${error.message}`);
        console.error('🧪 DirectTest: Profile query error:', error);
        return;
      }
      
      if (!data) {
        setResult('❌ No profile data returned');
        return;
      }
      
      setResult(`✅ Profile found: ${data.username} (${data.balance} HP)`);
      console.log('🧪 DirectTest: Profile data:', data);
      
    } catch (error: any) {
      setResult(`❌ Profile test failed: ${error.message}`);
      console.error('🧪 DirectTest: Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-4 left-4 bg-black/90 text-white p-4 rounded-lg shadow-lg max-w-sm z-50 border border-white/20">
      <h3 className="font-bold mb-2">🔧 Direct Supabase Test</h3>
      
      <div className="space-y-2">
        <button
          onClick={testSupabaseClient}
          disabled={loading}
          className="w-full px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        
        <button
          onClick={testProfileQuery}
          disabled={loading}
          className="w-full px-3 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Profile Query'}
        </button>
      </div>
      
      <div className="mt-3 text-xs bg-gray-800 p-2 rounded max-h-20 overflow-y-auto">
        {result}
      </div>
    </div>
  );
}