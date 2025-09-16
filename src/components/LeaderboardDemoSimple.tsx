import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Play,
  Users,
  Star,
  Coins
} from 'lucide-react';

// Import the simple working leaderboard
import LeaderboardSimple from './LeaderboardSimple';

export default function LeaderboardDemoSimple() {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handleBonusAwarded = (userId: string, amount: number) => {
    console.log(`💰 Bonus awarded: ${amount} Happy Paisa to user ${userId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            🏆 Enhanced Leaderboard Demo
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg"
          >
            Click the button below to see the enhanced leaderboard in action!
          </motion.p>
        </div>

        {/* Demo Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 rounded-xl p-8 border border-white/10 text-center"
        >
          <div className="mb-6">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Enhanced Leaderboard</h2>
            <p className="text-white/60">
              Beautiful animations, bonus rewards, and real-time feel
            </p>
          </div>

          <motion.button
            onClick={() => setShowLeaderboard(true)}
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-5 h-5" />
            <span className="text-lg font-medium">Open Leaderboard</span>
          </motion.button>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="text-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
              <div className="text-sm text-white/70">Animations</div>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
              <div className="text-sm text-white/70">Bonus Rewards</div>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
              <div className="text-sm text-white/70">Rankings</div>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
              <div className="text-sm text-white/70">Filters</div>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-blue-600/20 rounded-xl p-6 border border-blue-500/30"
        >
          <h3 className="text-lg font-semibold text-blue-300 mb-3">🎮 Try These Features:</h3>
          <div className="space-y-2 text-blue-200/80 text-sm">
            <p>• Click "Award Bonuses" to see the celebration animation</p>
            <p>• Use the timeframe and game filters</p>
            <p>• Notice the rank badges and user highlighting</p>
            <p>• Check the browser console for bonus award logs</p>
          </div>
        </motion.div>

        {/* Integration Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 bg-white/5 rounded-xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-semibold text-white mb-3">📋 Integration Status:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="text-green-400 font-medium mb-2">✅ Working Features:</h4>
              <ul className="space-y-1 text-white/70">
                <li>• Enhanced leaderboard modal</li>
                <li>• Beautiful animations and transitions</li>
                <li>• Bonus reward system</li>
                <li>• Mock data integration</li>
                <li>• Filter functionality</li>
              </ul>
            </div>
            <div>
              <h4 className="text-yellow-400 font-medium mb-2">🚀 Next Steps:</h4>
              <ul className="space-y-1 text-white/70">
                <li>• Connect to your backend API</li>
                <li>• Set up WebSocket for real-time updates</li>
                <li>• Add user authentication</li>
                <li>• Implement reward distribution</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Leaderboard Modal */}
      <LeaderboardSimple
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        onBonusAwarded={handleBonusAwarded}
      />
    </div>
  );
}