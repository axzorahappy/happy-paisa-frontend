import { useState } from 'react';
import { supabaseAPI } from '../services/supabaseAPI';
import { useAuth } from '../contexts/AuthContext';

export default function SimpleTest() {
  const [result, setResult] = useState<string>('Click button to test');
  const { signOut } = useAuth();

  const testProfile = async () => {
    try {
      setResult('Loading profile...');
      const profile = await supabaseAPI.getUserProfile('97c65e10-bbcf-48db-8ca1-880cb7f5174b');
      setResult(`✅ Success: ${profile.username} (${profile.email}) - Balance: ${profile.balance}`);
    } catch (error: any) {
      setResult(`❌ Error: ${error.message}`);
    }
  };

  const testSession = async () => {
    try {
      setResult('Checking session...');
      const session = await supabaseAPI.getSession();
      if (session?.user) {
        setResult(`✅ Session found: ${session.user.email}`);
      } else {
        setResult(`❌ No session found`);
      }
    } catch (error: any) {
      setResult(`❌ Session error: ${error.message}`);
    }
  };

  const testSignOut = async () => {
    try {
      setResult('Signing out...');
      await signOut();
      setResult('✅ Signed out successfully!');
    } catch (error: any) {
      setResult(`❌ Sign out failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6">Supabase Test</h1>
        
        <div className="space-y-4">
          <button
            onClick={testProfile}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test Profile Loading
          </button>
          
          <button
            onClick={testSession}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Test Session
          </button>
          
          <button
            onClick={testSignOut}
            className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Test Sign Out
          </button>
          
          <div className="bg-black/20 p-4 rounded-lg text-white text-sm whitespace-pre-wrap">
            {result}
          </div>
        </div>
      </div>
    </div>
  );
}
