import { Coins, Gamepad2, Sparkles, Shield, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import FloatingMrHappy from '../components/FloatingMrHappy'

declare global {
  interface Window {
    netlifyIdentity: any;
  }
}

function openNetlifyModal() {
  if (window.netlifyIdentity) {
    window.netlifyIdentity.open();
  }
}

function Feature({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-3 inline-flex items-center justify-center rounded-lg bg-white/10 p-2 text-brand-200">
        <Icon size={18} />
      </div>
      <div className="font-medium">{title}</div>
      <div className="text-sm text-white/70">{desc}</div>
    </motion.div>
  )
}

export default function Home() {

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Aurora background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-20%] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-brand-700/50 to-brand-400/40 blur-3xl animate-aurora" />
          <div className="absolute right-[10%] top-[30%] h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-brand-800/40 to-brand-500/30 blur-3xl animate-aurora-slow" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
            >
              <span className="bg-gradient-to-r from-brand-300 to-white bg-clip-text text-transparent">Earn HP rewards</span>
              <br /> by playing, exploring, and converting.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="mt-6 text-pretty text-white/80 text-lg max-w-2xl mx-auto"
            >
              A safe, fast way to turn fun into value. Create your account to discover games and start earning Happy Paisa rewards.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-8 flex flex-wrap justify-center items-center gap-3"
            >
              <button onClick={openNetlifyModal} className="rounded-lg px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-brand-600 to-brand-400 shadow-sm hover:opacity-95 inline-flex items-center gap-2">
                Get Started <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={openNetlifyModal} className="rounded-lg border border-white/15 bg-white/5 px-8 py-4 text-base text-white/90 hover:bg-white/10 inline-flex items-center gap-2">
                Sign In <Gamepad2 className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted by marquee */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent [mask-image:linear-gradient(90deg,transparent,black,transparent)]" />
          <div className="marquee whitespace-nowrap py-3 text-white/70">
            <span className="mx-6">Trusted by players worldwide</span>
            <span className="mx-6">High‑payout challenges</span>
            <span className="mx-6">Fast claims</span>
            <span className="mx-6">Secure authentication</span>
            <span className="mx-6">Built‑in AI tips</span>
            <span className="mx-6">Trusted by players worldwide</span>
            <span className="mx-6">High‑payout challenges</span>
            <span className="mx-6">Fast claims</span>
            <span className="mx-6">Secure authentication</span>
            <span className="mx-6">Built‑in AI tips</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Feature icon={Gamepad2} title="Play to earn" desc="Choose from curated games and claim HP after sessions." />
          <Feature icon={Coins} title="Convert easily" desc="Turn rewards into coins when you’re ready to cash in." />
          <Feature icon={Sparkles} title="AI assistant" desc="Get tips and guidance from our built‑in AI helper." />
          <Feature icon={Shield} title="Secure auth" desc="Backed by industry‑standard auth and safe endpoints." />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { step: '1', title: 'Sign in', desc: 'Create an account and set your dev user if needed.' },
            { step: '2', title: 'Play', desc: 'Start game sessions and complete the required time.' },
            { step: '3', title: 'Claim & convert', desc: 'Claim HP, then convert rewards to coins.' },
          ].map((s) => (
            <motion.div key={s.step} whileHover={{ y: -2 }} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="mb-2 text-sm text-white/70">Step {s.step}</div>
              <div className="font-medium">{s.title}</div>
              <div className="text-sm text-white/70">{s.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-white/60">© {new Date().getFullYear()} Happy Paisa</div>
      </footer>

      {/* Floating Mr. Happy Chat Widget */}
      <FloatingMrHappy />
    </div>
  )
}
