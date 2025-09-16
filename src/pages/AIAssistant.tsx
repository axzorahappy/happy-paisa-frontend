import { motion } from 'framer-motion'
import MrHappyAIPanel from '../sections/MrHappyAIPanel'

export default function AIAssistant() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Mr. Happy AI Assistant</h1>
          <p className="text-white/70">Chat with your personal AI gaming companion</p>
        </div>
      </div>

      {/* Features Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-xl p-6 border border-white/10"
        >
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🎤</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Voice Commands</h3>
          <p className="text-white/60 text-sm">Say "Hey Mr. Happy" to activate voice mode and chat hands-free</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 rounded-xl p-6 border border-white/10"
        >
          <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🎮</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Gaming Tips</h3>
          <p className="text-white/60 text-sm">Get personalized advice on games, strategies, and earning rewards</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 rounded-xl p-6 border border-white/10"
        >
          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">💰</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Account Help</h3>
          <p className="text-white/60 text-sm">Ask about your balance, rewards, conversion rates, and more</p>
        </motion.div>
      </div>

      {/* Mr. Happy AI Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <MrHappyAIPanel />
      </motion.div>

      {/* Usage Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl p-6 border border-purple-500/20"
      >
        <h3 className="text-lg font-semibold text-white mb-4">💡 How to Use Mr. Happy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/80">
          <div>
            <h4 className="font-medium text-white mb-2">Voice Commands:</h4>
            <ul className="space-y-1 text-white/60">
              <li>• "Hey Mr. Happy" - Activate voice mode</li>
              <li>• "Show my balance" - Check your HP balance</li>
              <li>• "What games can I play?" - Get game recommendations</li>
              <li>• "How do I earn more rewards?" - Get earning tips</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Chat Examples:</h4>
            <ul className="space-y-1 text-white/60">
              <li>• Ask about conversion rates</li>
              <li>• Get help with game strategies</li>
              <li>• Request your reward history</li>
              <li>• Learn about new features</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}