import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Trophy, Star, Coins, TrendingUp, Zap, Clock, User } from 'lucide-react'
import GameModal from '../components/games/GameModal'
import { useAuth } from '../contexts/AuthContext'
import { supabaseAPI } from '../services/supabaseAPI'
interface GameInfo {
  id: string
  title: string
  description: string
  icon: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  maxReward: number
  playTime: string
  color: string
}

interface RecentReward {
  gameType: string
  amount: number
  timestamp: number
}

export default function GamesDashboard() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [showGameModal, setShowGameModal] = useState(false)
  const [recentRewards, setRecentRewards] = useState<RecentReward[]>([])
  const [walletBalance, setWalletBalance] = useState(0)
  const [totalEarned, setTotalEarned] = useState(0)
  const [loading, setLoading] = useState(false)
  
  const { isAuthenticated, profile, refreshProfile } = useAuth()

  // Load wallet balance on component mount and when auth/profile changes
  useEffect(() => {
    loadWalletData()
  }, [isAuthenticated, profile])

  const loadWalletData = async () => {
    try {
      if (isAuthenticated) {
        const balanceData = await supabaseAPI.getWalletBalance()
        setWalletBalance(balanceData.balance)
        setTotalEarned(balanceData.totalEarned)
      } else {
        // Guest mode - show placeholder data
        setWalletBalance(0)
        setTotalEarned(0)
      }
    } catch (error) {
      console.error('Error loading wallet data:', error)
      setWalletBalance(0)
      setTotalEarned(0)
    }
  }

  const games: GameInfo[] = [
    {
      id: 'clicker',
      title: 'Happy Clicker',
      description: 'Click as fast as you can for 30 seconds!',
      icon: '👆',
      difficulty: 'Easy',
      maxReward: 100,
      playTime: '30 sec',
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 'memory',
      title: 'Memory Match',
      description: 'Match pairs of cards and train your memory',
      icon: '🧠',
      difficulty: 'Medium',
      maxReward: 150,
      playTime: '1-2 min',
      color: 'from-pink-600 to-rose-600'
    },
    {
      id: 'math',
      title: 'Math Quiz',
      description: 'Solve math problems as fast as you can',
      icon: '🧮',
      difficulty: 'Hard',
      maxReward: 200,
      playTime: '2-3 min',
      color: 'from-blue-600 to-purple-600'
    },
    {
      id: 'snake',
      title: 'Snake Game',
      description: 'Eat food and grow as long as possible',
      icon: '🐍',
      difficulty: 'Medium',
      maxReward: 250,
      playTime: '2-5 min',
      color: 'from-green-600 to-emerald-600'
    },
    {
      id: 'word',
      title: 'Word Puzzle',
      description: 'Unscramble letters to form words',
      icon: '📝',
      difficulty: 'Medium',
      maxReward: 180,
      playTime: '1-2 min',
      color: 'from-orange-600 to-red-600'
    }
  ]

  const playGame = (gameId: string) => {
    setSelectedGame(gameId)
    setShowGameModal(true)
  }

  const handleRewardEarned = async (amount: number, gameType: string, score?: number, timeSpent?: number) => {
    setRecentRewards(prev => [
      { gameType, amount, timestamp: Date.now() },
      ...prev.slice(0, 4) // Keep only last 5 rewards
    ])
    
    // Submit real score to backend
    try {
      if (isAuthenticated && score !== undefined) {
        const gameData = {
          game_type: gameType as 'clicker' | 'memory' | 'math' | 'snake' | 'word',
          score: score,
          time_spent: timeSpent || 30
        }
        
        const result = await supabaseAPI.submitGameScore(gameData)
        console.log(`🎉 Real reward earned: ${result.reward} HP, New balance: ${result.newBalance}`)
        
        // Update wallet balance with real data
        setWalletBalance(result.newBalance)
        setTotalEarned(prev => prev + result.reward)
        
        // Refresh profile to get updated stats
        await refreshProfile()
      } else {
        console.log('Not authenticated - please sign in to save game progress')
      }
    } catch (error) {
      console.error('Error submitting game score:', error)
    }
  }

  const closeGameModal = () => {
    setShowGameModal(false)
    setSelectedGame(null)
  }


  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-300'
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300'
      case 'Hard': return 'bg-red-500/20 text-red-300'
      default: return 'bg-gray-500/20 text-gray-300'
    }
  }

  const getTotalEarned = () => {
    return recentRewards.reduce((total, reward) => total + reward.amount, 0)
  }

  const getGameTitle = (gameType: string) => {
    const game = games.find(g => g.id === gameType)
    return game?.title || gameType
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Games</h1>
          <p className="text-white/70">Play mini-games and earn Happy Paisa rewards!</p>
        </div>
        
        {/* Stats */}
        <div className="flex items-center space-x-4">
          <div className="bg-white/10 rounded-lg px-4 py-2 text-center">
            <div className="text-lg font-bold text-green-400">{walletBalance.toLocaleString()}</div>
            <div className="text-xs text-white/70">Current Balance</div>
          </div>
          <div className="bg-white/10 rounded-lg px-4 py-2 text-center">
            <div className="text-lg font-bold text-purple-400">{totalEarned.toLocaleString()}</div>
            <div className="text-xs text-white/70">Total Earned</div>
          </div>
          <div className="bg-white/10 rounded-lg px-4 py-2 text-center">
            <div className="text-lg font-bold text-blue-400">{recentRewards.length}</div>
            <div className="text-xs text-white/70">Games Played</div>
          </div>
        </div>
      </div>

      {/* Recent Rewards */}
      {recentRewards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl p-6 border border-green-500/30"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
            Recent Rewards
          </h3>
          <div className="space-y-2">
            {recentRewards.slice(0, 3).map((reward, index) => (
              <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {games.find(g => g.id === reward.gameType)?.icon || '🎮'}
                  </div>
                  <div>
                    <div className="font-medium text-white">{getGameTitle(reward.gameType)}</div>
                    <div className="text-sm text-white/60">
                      {new Date(reward.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Coins className="w-4 h-4 text-green-400" />
                  <span className="font-bold text-green-400">+{reward.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-all group cursor-pointer"
            onClick={() => playGame(game.id)}
          >
            {/* Game Header */}
            <div className={`h-32 bg-gradient-to-br ${game.color} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20" />
              
              {/* Game Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                  {game.icon}
                </div>
              </div>
              
              {/* Difficulty Badge */}
              <div className="absolute top-4 left-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                  {game.difficulty}
                </span>
              </div>
              
              {/* Max Reward */}
              <div className="absolute top-4 right-4 flex items-center space-x-1 bg-black/30 rounded-full px-2 py-1">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-bold text-sm">{game.maxReward}</span>
              </div>
            </div>

            {/* Game Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                  {game.title}
                </h3>
                <div className="flex items-center space-x-1 text-white/50">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs">{game.playTime}</span>
                </div>
              </div>
              
              <p className="text-white/60 text-sm mb-4 line-clamp-2">
                {game.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-white/50 text-xs">
                  <Trophy className="w-4 h-4" />
                  <span>Up to {game.maxReward} HP</span>
                </div>
                
                <motion.div
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-4 h-4 text-white" />
                  <span className="text-white font-medium">Play</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 rounded-xl p-6 border border-white/10"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-400" />
          How to Earn Rewards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/70">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-purple-400 font-bold">1</span>
            </div>
            <div>
              <div className="font-medium text-white mb-1">Choose a Game</div>
              <div>Pick any mini-game that interests you</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-purple-400 font-bold">2</span>
            </div>
            <div>
              <div className="font-medium text-white mb-1">Play & Score</div>
              <div>Higher scores earn more Happy Paisa</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-purple-400 font-bold">3</span>
            </div>
            <div>
              <div className="font-medium text-white mb-1">Claim Rewards</div>
              <div>Instantly receive Happy Paisa to your account</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Game Modal */}
      <GameModal
        isOpen={showGameModal}
        onClose={closeGameModal}
        gameType={selectedGame || ''}
        onRewardEarned={handleRewardEarned}
      />

    </div>
  )
}