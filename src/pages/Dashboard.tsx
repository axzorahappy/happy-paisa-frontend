import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import AuthPanel from '../components/AuthPanel'
import { motion } from 'framer-motion'
import AIPanel from '../sections/AIPanel'
import { HaCard, HaCardContent, HaCardActions } from '../components/ui/HaCard'
import { HaProgressRing, StatsCard } from '../components/ui/HaProgressRing'
import { StatsChart, MiniStatsChart } from '../components/charts/StatsChart'
import { Coins, Gamepad2, Target, TrendingUp, Clock, Star } from 'lucide-react'
import Section from '../components/ui/Section'

// Generate mock data for charts
function generateMockData() {
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });
  
  return dates.map((date, i) => ({
    date,
    value: Math.floor(Math.random() * 100) + 50 + i * 10
  }));
}

export default function Dashboard() {
  const [devUserId, setDevUserId] = useState('test-user-1')
  const [profile, setProfile] = useState<any>(null)
  const [rewards, setRewards] = useState<any>(null)
  const [games, setGames] = useState<any[]>([])
  const [coinsToConvert, setCoinsToConvert] = useState('')
  const [convertResult, setConvertResult] = useState<any>(null)

  const [active, setActive] = useState<null | { gameId: string; sessionId: string; externalUrl?: string; endsAt: number }>(null)
  const [remaining, setRemaining] = useState(0)

  const headersUser = useMemo(() => devUserId.trim() || 'test-user-1', [devUserId])

  const loadProfile = async () => { try { setProfile(await api('/api/me', { method: 'GET' }, headersUser)) } catch (e:any) { setProfile(e.message) } }
  const loadRewards = async () => { try { setRewards(await api('/api/rewards', { method: 'GET' }, headersUser)) } catch (e:any) { setRewards(e.message) } }
  const loadGames = async () => { try { const r = await api('/api/games'); setGames(r.games || []) } catch (e:any) { alert(e.message) } }
  const play = async (id: string) => { try { await api(`/api/games/${id}/reward`, { method: 'POST' }, headersUser); await loadRewards(); } catch (e:any) { alert(e.message) } }
  const startExternal = async (id: string) => {
    try {
      const r = await api(`/api/games/${id}/start`, { method: 'POST' }, headersUser)
      if (r.externalUrl) window.open(r.externalUrl, '_blank', 'noopener')
      const endsAt = Date.now() + (r.requiredDuration || 60) * 1000
      setActive({ gameId: id, sessionId: r.sessionId, externalUrl: r.externalUrl, endsAt })
      setRemaining(Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)))
    } catch (e:any) { alert(e.message) }
  }
  const claimExternal = async () => {
    if (!active) return
    if (remaining > 0) { alert(`Please wait ${remaining}s before claiming`) ; return }
    try {
      const body = { sessionId: active.sessionId }
      const r = await api(`/api/games/${active.gameId}/claim`, { method: 'POST', body: JSON.stringify(body) }, headersUser)
      alert(`Claimed +${r.added} rewards!`)
      setActive(null)
      setRemaining(0)
      await loadRewards()
    } catch (e:any) { alert(e.message) }
  }
  useEffect(() => {
    if (!active) return
    const t = setInterval(() => {
      const secs = Math.max(0, Math.ceil((active.endsAt - Date.now()) / 1000))
      setRemaining(secs)
      if (secs <= 0) clearInterval(t)
    }, 1000)
    return () => clearInterval(t)
  }, [active])

  const convert = async () => {
    setConvertResult(null)
    try { const body = { coinsToConvert: Number(coinsToConvert) || 0 }; const r = await api('/api/rewards/convert', { method: 'POST', body: JSON.stringify(body) }, headersUser); setConvertResult(r) } catch (e:any) { setConvertResult(e.message) }
  }

  useEffect(() => { loadGames() }, [])

  return (
    <div className="container row" style={{ paddingTop: 24, paddingBottom: 24 }}>
      <div>
        <Section title="Login">
          <AuthPanel />
        </Section>

        <div id="ai">
          <Section title="AI Assistant (server-side, safe)">
            <AIPanel />
          </Section>
        </div>

        <Section title="Dev User">
          <div>
            <div className="text-sm">X-User-Id (dev mode)</div>
            <input value={devUserId} onChange={(e) => setDevUserId(e.target.value)} placeholder="test-user-1" className="input" />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={loadProfile} className="btn btn-primary">Load Profile</button>
            <button onClick={loadRewards} className="btn">Load Rewards</button>
          </div>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(profile, null, 2)}</pre>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(rewards, null, 2)}</pre>
        </Section>

        <Section title="Convert Rewards → Coins">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
            <input value={coinsToConvert} onChange={(e) => setCoinsToConvert(e.target.value)} placeholder="Coins to convert" style={{ padding: 10, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'white' }} />
            <button onClick={convert} style={{ padding: '8px 12px' }}>Convert</button>
          </div>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(convertResult, null, 2)}</pre>
        </Section>
      </div>

      <div>
        <Section title="Games">
          <div style={{ overflow: 'auto' }}>
            {games.map(g => (
              <div key={g.id} style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 12, marginBottom: 8 }}>
                <div style={{ fontWeight: 600 }}>{g.title}</div>
                <div style={{ opacity: 0.75 }}>{g.description}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, gap: 8 }}>
                  <div>{g.reward} HP • <span style={{ opacity: 0.8 }}>{g.difficulty}</span></div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => play(g.id)} style={{ padding: '6px 10px' }}>Dev Award +{g.reward}</button>
                    {g.externalUrl ? (
                      <button onClick={() => startExternal(g.id)} style={{ padding: '6px 10px' }}>Play external</button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}

            {active && (
              <div style={{ border: '1px dashed rgba(255,255,255,0.3)', borderRadius: 10, padding: 12, marginTop: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Active session</div>
                <div>Time remaining: {remaining}s</div>
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  <button onClick={claimExternal} disabled={remaining > 0} style={{ padding: '6px 10px' }}>
                    {remaining > 0 ? `Wait ${remaining}s` : 'Claim reward'}
                  </button>
                  {active.externalUrl && (
                    <a href={active.externalUrl} target="_blank" rel="noreferrer" style={{ color: '#b084ff' }}>Open game</a>
                  )}
                </div>
              </div>
            )}
          </div>
        </Section>
      </div>
    </div>
  )
}
