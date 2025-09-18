import { Coins, Gamepad2, Sparkles, Shield, ArrowRight, UserPlus } from 'lucide-react'

declare global {
  interface Window {
    netlifyIdentity: any;
  }
}

function openNetlifyModal(action: 'signup' | 'login') {
  if (window.netlifyIdentity) {
    window.netlifyIdentity.open(action);
  }
}

function Feature({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="card text-center">
      <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-brand-light p-3 text-brand">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted text-sm">{desc}</p>
    </div>
  )
}

export default function Home() {
  return (
    <div className="container">
      {/* Hero Section */}
      <header className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          The Fun Way to Earn Rewards
        </h1>
        <p className="text-lg text-muted max-w-3xl mx-auto mb-8">
          Discover games, complete challenges, and convert your time into real value. Join Happy Paisa and start earning today.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4">
          <button onClick={() => openNetlifyModal('signup')} className="btn btn-primary inline-flex items-center gap-2">
            <UserPlus size={18} />
            Create an Account
          </button>
          <button onClick={() => openNetlifyModal('login')} className="btn btn-secondary inline-flex items-center gap-2">
            <ArrowRight size={18} />
            Sign In
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Feature icon={Gamepad2} title="Play to Earn" desc="Choose from curated games and claim HP after sessions." />
          <Feature icon={Coins} title="Convert Easily" desc="Turn rewards into coins when you’re ready to cash in." />
          <Feature icon={Sparkles} title="AI Assistant" desc="Get tips and guidance from our built-in AI helper." />
          <Feature icon={Shield} title="Secure Auth" desc="Backed by industry-standard auth and safe endpoints." />
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-2">How It Works</h2>
          <p className="text-muted">A simple, three-step process to get you started.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="card text-center">
            <div className="text-4xl font-bold text-brand mb-2">1</div>
            <h3 className="text-lg font-semibold mb-2">Sign In</h3>
            <p className="text-muted text-sm">Create an account and set your dev user if needed.</p>
          </div>
          <div className="card text-center">
            <div className="text-4xl font-bold text-brand mb-2">2</div>
            <h3 className="text-lg font-semibold mb-2">Play</h3>
            <p className="text-muted text-sm">Start game sessions and complete the required time.</p>
          </div>
          <div className="card text-center">
            <div className="text-4xl font-bold text-brand mb-2">3</div>
            <h3 className="text-lg font-semibold mb-2">Claim & Convert</h3>
            <p className="text-muted text-sm">Claim HP, then convert rewards to coins.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-border mt-16">
        <p className="text-muted text-sm">© {new Date().getFullYear()} Happy Paisa. All rights reserved.</p>
      </footer>
    </div>
  )
}
