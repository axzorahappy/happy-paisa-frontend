import { Coins, Gamepad2, Sparkles, Shield, ArrowRight, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.div 
      className="bg-[#2c2c2c] p-6 rounded-lg border border-gray-700" 
      whileHover={{ y: -5, boxShadow: '0px 10px 20px rgba(0,0,0,0.2)' }}
    >
      <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-blue-500/20 p-3 text-blue-400">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="bg-[#1a1a1a] text-white">
      {/* Hero Section */}
      <motion.header 
        className="text-center py-24 md:py-32 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a1a]"></div>
        <div className="container relative">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            The Smart Way to Manage Your Finances
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-300 max-w-3xl mx-auto mb-10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Happy Paisa is your all-in-one smart assistant for recharges, bill payments, travel, and more, with integrated gaming to earn rewards.
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center items-center gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <button onClick={() => openNetlifyModal('signup')} className="px-8 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
              Get Started
            </button>
            <button onClick={() => openNetlifyModal('login')} className="px-8 py-3 font-semibold text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              Sign In
            </button>
          </motion.div>
        </div>
      </motion.header>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need, All in One Place</h2>
            <p className="text-gray-400">From managing your bills to earning rewards, Happy Paisa simplifies your financial life.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Feature icon={Gamepad2} title="Play to Earn" desc="Earn Happy Paisa (HP) by playing fun and engaging games." />
            <Feature icon={Coins} title="Convert & Spend" desc="Easily convert your HP into real value for payments and recharges." />
            <Feature icon={Sparkles} title="AI Assistant" desc="Let Mr. Happy guide you with smart suggestions and financial tips." />
            <Feature icon={Shield} title="Bank-Grade Security" desc="Your data and transactions are protected with the highest security standards." />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 border-t border-gray-800 mt-16">
        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Happy Paisa. All rights reserved.</p>
      </footer>
    </div>
  );
}
