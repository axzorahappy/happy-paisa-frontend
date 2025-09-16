import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function SupabaseTest() {
  const { user, profile, session, isAuthenticated, loading } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    setDebugInfo({
      user: user ? {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      } : null,
      profile: profile ? {
        id: profile.id,
        username: profile.username,
        email: profile.email
      } : null,
      session: !!session,
      isAuthenticated,
      loading
    });
  }, [user, profile, session, isAuthenticated, loading]);

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🔍 Supabase Debug</h3>
      <pre className="whitespace-pre-wrap overflow-auto max-h-96">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
}