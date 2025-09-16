import { useState } from 'react'
import { api } from '../lib/api'
import { motion } from 'framer-motion'

export default function AIPanel() {
  const [prompt, setPrompt] = useState('Give me a short tip to earn more HP rewards.')
  const [answer, setAnswer] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const ask = async () => {
    try {
      setLoading(true)
      setAnswer('')
      const r = await api('/api/ai/complete', {
        method: 'POST',
        body: JSON.stringify({ prompt, maxTokens: 200 }),
        headers: { 'Content-Type': 'application/json' },
      })
      setAnswer(r.content || '(no content)')
    } catch (e: any) {
      setAnswer(e.message || 'AI error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} className="input" />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button onClick={ask} disabled={loading} className="btn btn-primary">
          {loading ? 'Thinking…' : 'Ask AI'}
        </button>
      </div>
      {answer && (
        <div className="card" style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>
          {answer}
        </div>
      )}
    </motion.div>
  )
}

