import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Rocket } from 'lucide-react'

const nav = [
  { name: 'Home', to: '/' },
  { name: 'Dashboard', to: '/app' },
  { name: 'Wallet', to: '/app/wallet' },
  { name: 'AI', to: '/app#ai' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur supports-[backdrop-filter]:bg-white/5">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 shadow-inner" />
          <span className="text-lg font-semibold tracking-tight">Happy Paisa</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `relative text-sm transition-colors ${isActive ? 'text-white' : 'text-white/80 hover:text-white'}`
              }
            >
              {({ isActive }) => (
                <span className="inline-flex items-center gap-2">
                  {n.name}
                  {n.name === 'AI' && (
                    <span className="rounded-md border border-white/15 bg-white/5 px-1.5 py-0.5 text-[10px] leading-none text-white/75">Beta</span>
                  )}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full'}`}
                  />
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/app"
            className="rounded-lg px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-brand-600 to-brand-400 shadow-sm shadow-brand-900/20 hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <span className="inline-flex items-center gap-2"><Rocket size={16} /> Launch App</span>
          </Link>
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-white/10 bg-white/5 text-white/90"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden border-t border-white/10 bg-[rgba(17,17,27,0.9)] backdrop-blur"
          >
            <div className="px-4 py-3 space-y-1">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm text-white/90 hover:bg-white/5"
                >
                  {n.name}
                </Link>
              ))}
              <Link
                to="/app"
                onClick={() => setOpen(false)}
                className="mt-2 block rounded-md px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-brand-600 to-brand-400"
              >
                <span className="inline-flex items-center gap-2"><Rocket size={16} /> Launch App</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
