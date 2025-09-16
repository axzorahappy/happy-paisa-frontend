import { useEffect, useState } from 'react'
import { getSupabase } from '../lib/supabase'

import { motion } from 'framer-motion'

export default function AuthPanel() {
  const supabase = getSupabase()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const configured = Boolean(supabase)

  useEffect(() => {
    if (!supabase) return
    const run = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user ?? null)
    }
    run()
    const sub = supabase.auth.onAuthStateChange((_ev, session) => setUser(session?.user ?? null))
    return () => { sub.data.subscription.unsubscribe() }
  }, [supabase])

  async function signUp() {
    if (!supabase) return
    setError(null)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
  }

  async function signIn() {
    if (!supabase) return
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  if (!configured) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card">
        <div style={{ fontWeight: 600 }}>Login (Supabase)</div>
        <div className="text-sm">Not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the frontend .env to enable login.</div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 600 }}>Login (Supabase)</div>
          <div className="text-sm">{user ? `Signed in as ${user.email || user.id}` : 'Signed out'}</div>
        </div>
        {user ? (
          <button onClick={signOut} className="btn">Sign out</button>
        ) : null}
      </div>

      {!user && (
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr auto auto', marginTop: 8 }}>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" className="input" />
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="password" type="password" className="input" />
          <button onClick={signIn} className="btn btn-primary">Sign in</button>
          <button onClick={signUp} className="btn">Sign up</button>
        </div>
      )}

      {error && <div style={{ color: '#ff8', marginTop: 6 }}>{error}</div>}
    </motion.div>
  )
}

