import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HaCard, HaCardContent } from '../components/ui/HaCard'
import { StatsCard } from '../components/ui/HaProgressRing'
import { StatsChart, MiniStatsChart } from '../components/charts/StatsChart'
import { Coins, Gamepad2, Target, TrendingUp, Clock, Star, Trophy, Zap } from 'lucide-react'
import { formatCoins, formatRelativeTime } from '../lib/utils'
import MrHappyAIPanel from '../sections/MrHappyAIPanel'

// Generate mock data for charts
function generateMockData(): Array<{date: string, value: number}> {
  const result: Array<{date: string, value: number}> = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0] ?? '2024-01-01';
    result.push({
      date: dateStr,
      value: Math.floor(Math.random() * 100) + 50 + i * 10
    });
  }
  return result;
}

export default function EnhancedDashboard() {
  const [profile, setProfile] = useState({ coins: 2450, level: 5 })
  const [rewards, setRewards] = useState({ balance: 1850 })

  // Mock data for demonstration
  const mockCoinsData = generateMockData()
  const mockRewardsData = generateMockData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Happy Paisa Dashboard
          </h1>
          <p className="text-white/70">
            Welcome back! Here's your gaming and rewards overview.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Happy Coins"
            value={profile?.coins || 150}
            total={1000}
            subtitle="Current balance"
            color="#f59e0b"
            icon={Coins}
          />
          <StatsCard
            title="Games Played"
            value={4}
            total={10}
            subtitle="Available games"
            color="#10b981"
            icon={Gamepad2}
          />
          <StatsCard
            title="Weekly Goal"
            value={rewards?.balance || 75}
            total={100}
            subtitle="Rewards earned"
            color="#8b5cf6"
            icon={Target}
          />
          <StatsCard
            title="Streak"
            value={7}
            total={30}
            subtitle="Days active"
            color="#ef4444"
            icon={Star}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            <StatsChart
              data={mockCoinsData}
              title="Coins Earned (7 Days)"
              color="#f59e0b"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <HaCard header="Rewards Conversion" raised>
                <HaCardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Available Rewards</span>
                      <span className="text-xl font-bold text-white">
                        {formatCoins(rewards?.balance || 0)}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <input
                        placeholder="Amount to convert"
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-purple-400"
                      />
                      <button
                        className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                      >
                        Convert to Coins
                      </button>
                    </div>
                    
                  </div>
                </HaCardContent>
              </HaCard>

              <HaCard header="Quick Stats">
                <HaCardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-white/80 text-sm">Best Score</span>
                      </div>
                      <span className="text-white font-medium">1,250</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-white/80 text-sm">Play Time</span>
                      </div>
                      <span className="text-white font-medium">2h 15m</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-purple-400" />
                        <span className="text-white/80 text-sm">Last Reward</span>
                      </div>
                      <span className="text-white font-medium">{formatRelativeTime(new Date(Date.now() - 3600000))}</span>
                    </div>
                    
                    <MiniStatsChart 
                      data={mockRewardsData.slice(-5)}
                      color="#8b5cf6"
                      className="mt-4"
                    />
                  </div>
                </HaCardContent>
              </HaCard>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <HaCard header="Quick Actions">
              <HaCardContent>
                <div className="space-y-3">
                  <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                    Play Random Game
                  </button>
                  <button className="w-full py-3 px-4 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-colors">
                    View Achievements
                  </button>
                  <button className="w-full py-3 px-4 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-colors">
                    Invite Friends
                  </button>
                </div>
              </HaCardContent>
            </HaCard>

            <HaCard header="Daily Progress">
              <HaCardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/80">Daily Goal</span>
                      <span className="text-white">75/100 HP</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-white/60 text-sm">25 HP to complete daily goal</p>
                  </div>
                </div>
              </HaCardContent>
            </HaCard>

            <HaCard header="Recent Activity">
              <HaCardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="text-sm">
                      <div className="text-white">Earned 50 HP</div>
                      <div className="text-white/60">Word Puzzle - 2m ago</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="text-sm">
                      <div className="text-white">Level up!</div>
                      <div className="text-white/60">Reached level 5 - 1h ago</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="text-sm">
                      <div className="text-white">Converted 200 HP</div>
                      <div className="text-white/60">To wallet - 3h ago</div>
                    </div>
                  </div>
                </div>
              </HaCardContent>
            </HaCard>
          </div>
        </div>

        {/* Welcome Banner */}
        <HaCard header="Welcome Back!" raised>
          <HaCardContent>
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-white mb-4">Ready to Earn More Happy Paisa?</h2>
              <p className="text-white/70 mb-6">Check out the Games section to start playing and earning rewards, or visit Rewards to track your progress.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Browse Games
                </button>
                <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-colors">
                  View Rewards
                </button>
              </div>
            </div>
          </HaCardContent>
        </HaCard>

        {/* Mr. Happy Voice AI Assistant */}
        <HaCard header="Mr. Happy - Your Voice AI Assistant" className="mt-6">
          <HaCardContent>
            <MrHappyAIPanel />
          </HaCardContent>
        </HaCard>
      </div>
    </div>
  )
}