import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, 
  Crown, 
  Medal, 
  Star, 
  Coins, 
  TrendingUp, 
  Calendar,
  Filter,
  User,
  Award,
  Zap
} from 'lucide-react'

interface LeaderboardUser {
  id: string
  username: string
  avatar?: string
  totalScore: number
  totalEarnings: number
  gamesPlayed: number
  bestGame: string
  bestScore: number
  rank: number
  rankChange: 'up' | 'down' | 'same' | 'new'
  isCurrentUser?: boolean
}

interface LeaderboardProps {
  isOpen: boolean
  onClose: () => void
  onBonusAwarded?: (userId: string, amount: number) => void
}

export default function LeaderboardSimple({ isOpen, onClose, onBonusAwarded }: LeaderboardProps) {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'alltime'>('weekly')
  const [gameFilter, setGameFilter] = useState<string>('all')
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showBonusAnimation, setShowBonusAnimation] = useState(false)

  // Mock data - in real app, this would come from your backend
  const mockLeaderboardData: LeaderboardUser[] = [
    {
      id: '1',
      username: 'GamerPro2024',
      avatar: '',
      totalScore: 15420,
      totalEarnings: 8750,
      gamesPlayed: 47,
      bestGame: 'Snake Game',
      bestScore: 340,
      rank: 1,
      rankChange: 'up',
      isCurrentUser: false
    },
    {
      id: '2', 
      username: 'MathWizard',
      avatar: '',
      totalScore: 14890,
      totalEarnings: 8200,
      gamesPlayed: 52,
      bestGame: 'Math Quiz',
      bestScore: 195,
      rank: 2,
      rankChange: 'down',
      isCurrentUser: false
    },
    {
      id: '3',
      username: 'MemoryMaster',
      avatar: '',
      totalScore: 13650,
      totalEarnings: 7800,
      gamesPlayed: 38,
      bestGame: 'Memory Match',
      bestScore: 280,
      rank: 3,
      rankChange: 'same',
      isCurrentUser: false
    },
    {
      id: '4',
      username: 'QuickClicker',
      avatar: '',
      totalScore: 12340,
      totalEarnings: 6900,
      gamesPlayed: 62,
      bestGame: 'Happy Clicker',
      bestScore: 156,
      rank: 4,
      rankChange: 'up',
      isCurrentUser: false
    },
    {
      id: '5',
      username: 'You', // Current user
      avatar: '',
      totalScore: 11850,
      totalEarnings: 6500,
      gamesPlayed: 28,
      bestGame: 'Word Puzzle',
      bestScore: 165,
      rank: 5,
      rankChange: 'new',
      isCurrentUser: true
    }
  ]

  const gameOptions = [
    { value: 'all', label: 'All Games' },
    { value: 'clicker', label: 'Happy Clicker' },
    { value: 'memory', label: 'Memory Match' },
    { value: 'math', label: 'Math Quiz' },
    { value: 'snake', label: 'Snake Game' },
    { value: 'word', label: 'Word Puzzle' }
  ]

  const bonusRewards = {
    1: 1000, // 1st place gets 1000 Happy Paisa bonus
    2: 500,  // 2nd place gets 500 Happy Paisa bonus
    3: 250   // 3rd place gets 250 Happy Paisa bonus
  }

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setLeaderboardData(mockLeaderboardData)
        setLoading(false)
      }, 1000)
    }
  }, [isOpen, timeframe, gameFilter])

  const awardBonuses = () => {
    const topThree = leaderboardData.slice(0, 3)
    setShowBonusAnimation(true)
    
    topThree.forEach((user, index) => {
      const bonus = bonusRewards[index + 1 as keyof typeof bonusRewards]
      if (onBonusAwarded) {
        onBonusAwarded(user.id, bonus)
      }
    })

    setTimeout(() => setShowBonusAnimation(false), 3000)
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <div className="w-6 h-6 flex items-center justify-center bg-white/20 rounded-full text-white text-sm font-bold">{rank}</div>
    }
  }

  const getRankChangeIcon = (change: string) => {
    switch (change) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
      case 'new':
        return <Star className="w-4 h-4 text-blue-400" />
      default:
        return null
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      const colors = {
        1: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
        2: 'bg-gradient-to-r from-gray-400 to-gray-600', 
        3: 'bg-gradient-to-r from-amber-500 to-amber-700'
      }
      return colors[rank as keyof typeof colors]
    }
    return 'bg-white/20'
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
              <p className="text-white/70">Top players and rankings</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={awardBonuses}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Coins className="w-4 h-4" />
              <span>Award Bonuses</span>
            </motion.button>
            
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-white/80 mb-2">Timeframe</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as any)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="daily" className="bg-slate-800">Today</option>
                <option value="weekly" className="bg-slate-800">This Week</option>
                <option value="monthly" className="bg-slate-800">This Month</option>
                <option value="alltime" className="bg-slate-800">All Time</option>
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-white/80 mb-2">Game</label>
              <select
                value={gameFilter}
                onChange={(e) => setGameFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {gameOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-slate-800">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bonus Rewards Info */}
        <div className="p-6 border-b border-white/10">
          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg p-4 border border-yellow-500/30">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold text-white">Weekly Bonus Rewards</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl mb-1">🥇</div>
                <div className="font-bold text-yellow-400">1,000 HP</div>
                <div className="text-white/60">1st Place</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🥈</div>
                <div className="font-bold text-gray-400">500 HP</div>
                <div className="text-white/60">2nd Place</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🥉</div>
                <div className="font-bold text-amber-600">250 HP</div>
                <div className="text-white/60">3rd Place</div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="overflow-y-auto max-h-96 p-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-4 animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/10 rounded w-1/3"></div>
                      <div className="h-3 bg-white/10 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboardData.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-lg p-4 border transition-all duration-300 ${
                    user.isCurrentUser 
                      ? 'bg-purple-600/20 border-purple-500/50 shadow-lg' 
                      : user.rank <= 3 
                        ? `${getRankBadge(user.rank)}/10 border-white/20` 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div className="flex items-center space-x-2">
                        {getRankIcon(user.rank)}
                        {getRankChangeIcon(user.rankChange)}
                      </div>
                      
                      {/* User Info */}
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full" />
                          ) : (
                            <User className="w-6 h-6 text-white" />
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-white">{user.username}</span>
                            {user.isCurrentUser && (
                              <span className="px-2 py-1 bg-purple-600/30 text-purple-300 text-xs rounded-full">You</span>
                            )}
                          </div>
                          <div className="text-sm text-white/60">
                            Best: {user.bestScore} pts in {user.bestGame}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="text-right">
                      <div className="font-bold text-white">{user.totalScore.toLocaleString()} pts</div>
                      <div className="text-sm text-white/60 flex items-center justify-end space-x-1">
                        <Coins className="w-3 h-3 text-green-400" />
                        <span>{user.totalEarnings.toLocaleString()} HP</span>
                        <span className="mx-1">•</span>
                        <span>{user.gamesPlayed} games</span>
                      </div>
                    </div>
                  </div>

                  {/* Bonus indicator for top 3 */}
                  {user.rank <= 3 && (
                    <div className="absolute top-2 right-2">
                      <motion.div
                        animate={showBonusAnimation ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                        transition={{ duration: 0.5, repeat: showBonusAnimation ? 3 : 0 }}
                        className="flex items-center space-x-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs"
                      >
                        <Coins className="w-3 h-3" />
                        <span>+{bonusRewards[user.rank as keyof typeof bonusRewards]}</span>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Bonus Animation */}
        <AnimatePresence>
          {showBonusAnimation && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-6xl"
              >
                🎉
              </motion.div>
              <div className="absolute text-center">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-3xl font-bold text-yellow-400 mb-2"
                >
                  Bonus Rewards Awarded!
                </motion.div>
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-white"
                >
                  Top 3 players received their bonus Happy Paisa!
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}