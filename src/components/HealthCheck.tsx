import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getBackendUrl } from '../lib/api'

export default function HealthCheck() {
  const [healthy, setHealthy] = useState<boolean | null>(null)
  const [info, setInfo] = useState<any>(null)
  const [justRecovered, setJustRecovered] = useState(false)
  const triedOnce = useRef(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    const ping = async () => {
      try {
        const url = import.meta.env.DEV ? '/api/health' : `${getBackendUrl()}/api/health`
        const r = await fetch(url)
        if (!r.ok) throw new Error(await r.text())
        const data = await r.json()
        setInfo(data)
        setHealthy(true)
        if (triedOnce.current) {
          setJustRecovered(true)
          window.setTimeout(() => setJustRecovered(false), 2500)
        }
      } catch {
        setHealthy(false)
      } finally {
        triedOnce.current = true
      }
    }

    ping()
    timer.current = window.setInterval(ping, 5000) as unknown as number
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4">
      <AnimatePresence>
        {healthy === false && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200"
          >
            Cannot reach backend at {getBackendUrl()} — check that the server is running. Retrying…
          </motion.div>
        )}
        {justRecovered && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-200"
          >
            <span className="size-2 rounded-full bg-emerald-400" /> Connected • {info?.gameCount ?? 0} games
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}