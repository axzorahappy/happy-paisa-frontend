import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabaseAPI } from '../services/supabaseAPI';
import { httpSupabaseAPI } from '../services/httpSupabaseAPI';

export default function DebugPanel() {
  const [result, setResult] = useState('Ready for testing');
  const [loading, setLoading] = useState(false);
  const { signOut, user, profile, isAuthenticated, refreshProfile } = useAuth();

  const testSignOut = async () => {
    try {
      setLoading(true);
      setResult('Testing sign out...');
      console.log('🧪 DebugPanel: Starting sign out test');
      
      // Add timeout to prevent infinite hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign out timed out after 10 seconds')), 10000)
      );
      
      await Promise.race([signOut(), timeoutPromise]);
      
      setResult('✅ Sign out successful!');
      console.log('🧪 DebugPanel: Sign out test completed');
    } catch (error: any) {
      setResult(`❌ Sign out failed: ${error.message}`);
      console.error('🧪 DebugPanel: Sign out test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const testRefreshProfile = async () => {
    try {
      setLoading(true);
      setResult('Refreshing profile...');
      console.log('🧪 DebugPanel: Starting profile refresh test');
      
      await refreshProfile();
      
      setResult('✅ Profile refresh completed!');
      console.log('🧪 DebugPanel: Profile refresh test completed');
    } catch (error: any) {
      setResult(`❌ Profile refresh failed: ${error.message}`);
      console.error('🧪 DebugPanel: Profile refresh test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const testWallet = async () => {
    try {
      setLoading(true);
      setResult('Testing wallet...');
      console.log('🧪 DebugPanel: Starting wallet test');
      
      const balance = await supabaseAPI.getWalletBalance();
      const transactions = await supabaseAPI.getWalletTransactions(user?.id, 5);
      
      setResult(`✅ Wallet test successful! Balance: ${balance.balance} HP, Transactions: ${transactions.length}`);
      console.log('🧪 DebugPanel: Wallet test completed', { balance, transactions });
    } catch (error: any) {
      setResult(`❌ Wallet test failed: ${error.message}`);
      console.error('🧪 DebugPanel: Wallet test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const testHttpProfile = async () => {
    try {
      setLoading(true);
      setResult('Testing HTTP profile...');
      console.log('🧪 DebugPanel: Starting HTTP profile test');
      
      if (!user?.id) {
        setResult('❌ No user ID available');
        return;
      }
      
      const profile = await httpSupabaseAPI.getUserProfile(user.id);
      
      setResult(`✅ HTTP Profile success! ${profile.username} (${profile.balance} HP)`);
      console.log('🧪 DebugPanel: HTTP profile test completed', profile);
    } catch (error: any) {
      setResult(`❌ HTTP profile failed: ${error.message}`);
      console.error('🧪 DebugPanel: HTTP profile test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg shadow-lg max-w-sm z-50 border border-white/20">
      <h3 className="font-bold mb-2">🔧 Debug Panel</h3>
      
      <div className="text-xs mb-3 space-y-1">
        <div>User: {user?.email || 'None'}</div>
        <div>Profile: {profile?.username || 'None'}</div>
        <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
      </div>
      
      <div className="space-y-2">
        <button
          onClick={testRefreshProfile}
          disabled={loading}
          className="w-full px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh Profile'}
        </button>
        
        <button
          onClick={testSignOut}
          disabled={loading}
          className="w-full px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Sign Out'}
        </button>
        
        <button
          onClick={testHttpProfile}
          disabled={loading}
          className="w-full px-3 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test HTTP Profile'}
        </button>
        
        <button
          onClick={testWallet}
          disabled={loading}
          className="w-full px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Wallet'}
        </button>
      </div>
      
      <div className="mt-3 text-xs bg-gray-800 p-2 rounded max-h-20 overflow-y-auto">
        {result}
      </div>
    </div>
  );
}