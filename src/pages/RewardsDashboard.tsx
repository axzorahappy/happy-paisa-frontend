import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Coins, TrendingUp, Gift, ArrowUpRight, Calendar } from 'lucide-react'
import { formatCoins, formatRelativeTime } from '../lib/utils'
import { StatsChart } from '../components/charts/StatsChart'
import { api } from '../lib/api'

interface RewardHistory {
  id: string
  date: string
  type: 'game' | 'bonus' | 'conversion'
  amount: number
  source: string
  status: 'completed' | 'pending' | 'failed'
}

export default function RewardsDashboard() {
  const [balance] = useState(2450)
  const [totalEarned] = useState(12350)
  const [weeklyEarnings] = useState(385)
  const [timeFilter, setTimeFilter] = useState('7d')
  const [typeFilter, setTypeFilter] = useState('all')
  const [convertAmount, setConvertAmount] = useState('')
  const [converting, setConverting] = useState(false)
  const [rewardBalance, setRewardBalance] = useState(2450) // Happy Paisa balance
  const [hcBalance, setHcBalance] = useState(15.420) // HC balance
  const [conversionRate] = useState(0.001) // 1000 Happy Paisa = 1 HP
  const [showSuccess, setShowSuccess] = useState(false)
  const [history] = useState<RewardHistory[]>([
    {
      id: '1',
      date: new Date().toISOString(),
      type: 'game' as const,
      amount: 50,
      source: 'Word Puzzle Pro',
      status: 'completed' as const
    },
    {
      id: '2',
      date: new Date(Date.now() - 3600000).toISOString(),
      type: 'game' as const,
      amount: 75,
      source: 'Math Challenge',
      status: 'completed' as const
    },
    {
      id: '3',
      date: new Date(Date.now() - 7200000).toISOString(),
      type: 'bonus' as const,
      amount: 100,
      source: 'Daily Login Bonus',
      status: 'completed' as const
    }
  ])
  
  // Generate mock chart data
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return {
      date: date.toISOString().split('T')[0] || '',
      value: Math.floor(Math.random() * 100) + 50
    }
  })
  
  const loadRewards = async () => {
    try {
      const response = await api('/api/rewards')
      // Update state with real data when API is available
      console.log('Real rewards data loaded:', response)
    } catch (error) {
      // API not available, continue with mock data
      console.log('Using mock rewards data')
    }
  }
  
  const convertRewards = async () => {
    if (!convertAmount) return
    const amount = parseFloat(convertAmount)
    if (amount <= 0 || amount > rewardBalance) return

    setConverting(true)
    try {
      // Simulate API call (replace with real API when available)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Calculate converted HC (1000:1 ratio)
      const convertedHC = amount * conversionRate
      
      // Update balances
      setRewardBalance(prev => prev - amount)
      setHcBalance(prev => prev + convertedHC)
      
      // Clear input
      setConvertAmount('')
      
      // Show success notification
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      
      console.log(`Successfully converted ${amount} Happy Paisa to ${convertedHC} HC!`)
      
      // In a real app, you'd make an API call here:
      // await api('/api/rewards/convert', {
      //   method: 'POST',
      //   body: JSON.stringify({ rewardsToConvert: amount })
      // })
      
    } catch (error) {
      console.error('Failed to convert rewards:', error)
      alert('Conversion failed. Please try again.')
    } finally {
      setConverting(false)
    }
  }
  
  useEffect(() => {
    loadRewards()
  }, [])
  
  // Test complex filtering logic
  const filteredHistory = (history || []).filter(item => {
    if (typeFilter !== 'all' && item.type !== typeFilter) return false
    
    const itemDate = new Date(item.date)
    const now = new Date()
    const daysDiff = (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24)
    
    switch (timeFilter) {
      case '24h': return daysDiff <= 1
      case '7d': return daysDiff <= 7
      case '30d': return daysDiff <= 30
      default: return true
    }
  })
  
  
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Rewards Dashboard</h1>
        <p className="text-white/70 mt-2">Manage your Happy Paisa and convert them to HC</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Coins className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-yellow-400 text-sm font-medium">Available</span>
          </div>
          <div className="text-2xl font-bold text-white">{formatCoins(rewardBalance)}</div>
          <div className="text-purple-300 text-sm">Happy Paisa</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl p-6 border border-green-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Coins className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-green-400 text-sm font-medium">Converted</span>
          </div>
          <div className="text-2xl font-bold text-white">{hcBalance.toFixed(3)}</div>
          <div className="text-green-300 text-sm">HC Balance</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{formatCoins(totalEarned)}</div>
          <div className="text-white/60 text-sm">Total Earned</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Calendar className="w-6 h-6 text-green-400" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{formatCoins(weeklyEarnings)}</div>
          <div className="text-white/60 text-sm">This Week</div>
        </motion.div>
      </div>
      
      {/* Test Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <StatsChart
          data={chartData}
          title="Daily Earnings (7 Days)"
          color="#8b5cf6"
        />
      </motion.div>
      
      {/* Conversion Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/5 rounded-xl p-6 border border-white/10"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Convert Happy Paisa to HC</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Amount of Happy Paisa to Convert
            </label>
            <input
              type="number"
              value={convertAmount}
              onChange={(e) => setConvertAmount(e.target.value)}
              placeholder="Enter Happy Paisa amount"
              max={rewardBalance}
              step="1000"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="text-xs text-white/60 mt-1">
              Available Happy Paisa: {formatCoins(rewardBalance)}
            </div>
          </div>

          {convertAmount && (
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="text-sm text-white/80">You'll receive:</div>
              <div className="text-lg font-semibold text-green-400">
                {((parseFloat(convertAmount) || 0) * conversionRate).toFixed(3)} HC
              </div>
              <div className="text-xs text-white/60 mt-1">
                Conversion Rate: 1,000 Happy Paisa = 1 HC
              </div>
              {(parseFloat(convertAmount) || 0) < 1000 && convertAmount && (
                <div className="text-xs text-yellow-400 mt-1">
                  ⚠️ Minimum conversion: 1,000 Happy Paisa
                </div>
              )}
            </div>
          )}

          <button
            onClick={convertRewards}
            disabled={converting || !convertAmount || parseFloat(convertAmount) < 1000 || parseFloat(convertAmount) > rewardBalance}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {converting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Converting...</span>
              </div>
            ) : (
              'Convert to HC'
            )}
          </button>
        </div>
      </motion.div>
      
      {/* History List - THE SUSPECT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
      >
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
          <div className="flex space-x-3">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="24h" className="bg-slate-800">Last 24h</option>
              <option value="7d" className="bg-slate-800">Last 7 days</option>
              <option value="30d" className="bg-slate-800">Last 30 days</option>
              <option value="all" className="bg-slate-800">All time</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all" className="bg-slate-800">All types</option>
              <option value="game" className="bg-slate-800">Games</option>
              <option value="bonus" className="bg-slate-800">Bonuses</option>
              <option value="conversion" className="bg-slate-800">Conversions</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-white/10">
          {filteredHistory.map((item) => (
            <div key={item.id} className="p-6 hover:bg-white/5 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    item.type === 'game' ? 'bg-purple-500/20' :
                    item.type === 'bonus' ? 'bg-green-500/20' :
                    'bg-blue-500/20'
                  }`}>
                    {item.type === 'game' ? (
                      <Gift className="w-5 h-5 text-purple-400" />
                    ) : item.type === 'bonus' ? (
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-white">{item.source}</div>
                    <div className="text-sm text-white/60">{formatRelativeTime(new Date(item.date))}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${
                    item.status === 'completed' ? 'text-green-400' : 
                    item.status === 'pending' ? 'text-yellow-400' : 
                    'text-red-400'
                  }`}>
                    +{formatCoins(item.amount)} Happy Paisa
                  </div>
                  <div className={`text-xs capitalize ${
                    item.status === 'completed' ? 'text-green-400/70' : 
                    item.status === 'pending' ? 'text-yellow-400/70' : 
                    'text-red-400/70'
                  }`}>
                    {item.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <div className="p-12 text-center">
            <Gift className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white/70 mb-2">No Activity Found</h3>
            <p className="text-white/50">Start playing games to see your reward history here.</p>
          </div>
        )}
      </motion.div>
      
      {/* Success Notification */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-green-200 text-sm">✓</span>
            </div>
            <div>
              <div className="font-semibold">Conversion Successful!</div>
              <div className="text-sm text-green-200">Happy Paisa converted to HC</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
