import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import {
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  Star,
  Award,
  Zap,
  Users,
  Coins,
  Activity,
  Gamepad2,
  Medal,
  Crown
} from 'lucide-react';
import { useUserLeaderboardStats } from '../hooks/useLeaderboard';
import { leaderboardAPI } from '../services/leaderboardAPI';
import { UserStatsSummary, Achievement, UserAchievement } from '../types/leaderboard';

interface UserStatsPanelProps {
  userId?: string;
  isOpen: boolean;
  onClose: () => void;
}

interface GamePerformanceData {
  gameType: string;
  gamesPlayed: number;
  averageScore: number;
  bestScore: number;
  totalEarnings: number;
  winRate: number;
}

export default function UserStatsPanel({ userId, isOpen, onClose }: UserStatsPanelProps) {
  const { userStats, loading, error, refetch } = useUserLeaderboardStats(userId);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [performanceData, setPerformanceData] = useState<GamePerformanceData[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // Colors for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  useEffect(() => {
    if (isOpen && userStats) {
      // Transform user stats into chart-friendly format
      const gameData = Object.entries(userStats.gameStats).map(([gameType, stats]) => ({
        gameType,
        gamesPlayed: stats.gamesPlayed,
        averageScore: stats.averageScore,
        bestScore: stats.bestScore,
        totalEarnings: stats.totalEarnings,
        winRate: stats.winRate,
      }));
      setPerformanceData(gameData);

      // Fetch achievements
      fetchAchievements();
    }
  }, [isOpen, userStats]);

  const fetchAchievements = async () => {
    try {
      const userAchievements = await leaderboardAPI.getUserAchievements(userId);
      setAchievements(userAchievements);
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    }
  };

  const getGameIcon = (gameType: string) => {
    const icons: Record<string, string> = {
      clicker: '👆',
      memory: '🧠',
      math: '🧮',
      snake: '🐍',
      word: '📝',
    };
    return icons[gameType] || '🎮';
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank <= 3) return 'text-gray-400';
    if (rank <= 10) return 'text-amber-600';
    return 'text-white';
  };

  const calculateTotalPlayTime = () => {
    if (!userStats) return '0h 0m';
    const totalMinutes = Math.floor(userStats.totalPlayTime / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const getStreakStatus = () => {
    if (!userStats) return { color: 'text-gray-400', message: 'No streak' };
    
    if (userStats.currentStreak >= 7) {
      return { color: 'text-green-400', message: 'On fire!' };
    } else if (userStats.currentStreak >= 3) {
      return { color: 'text-yellow-400', message: 'Building momentum' };
    } else if (userStats.currentStreak > 0) {
      return { color: 'text-blue-400', message: 'Getting started' };
    }
    return { color: 'text-gray-400', message: 'Start your streak' };
  };

  if (!isOpen) return null;

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
        className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-xl border border-white/10 w-full max-w-6xl max-h-[95vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              {userStats?.username ? (
                <span className="text-white font-bold text-lg">
                  {userStats.username.charAt(0).toUpperCase()}
                </span>
              ) : (
                <Users className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {userStats?.username || 'User'} Stats
              </h2>
              <p className="text-white/70">Detailed performance analytics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-80px)] p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-8">
              <p>{error}</p>
              <button onClick={refetch} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">
                Retry
              </button>
            </div>
          ) : userStats ? (
            <div className="space-y-8">
              {/* Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-xl p-4 border border-yellow-500/30"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Trophy className={`w-5 h-5 ${getRankColor(userStats.overallRank)}`} />
                    <span className="text-white/70 text-sm">Overall Rank</span>
                  </div>
                  <div className={`text-2xl font-bold ${getRankColor(userStats.overallRank)}`}>
                    #{userStats.overallRank}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl p-4 border border-green-500/30"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-5 h-5 text-orange-400" />
                    <span className="text-white/70 text-sm">Current Streak</span>
                  </div>
                  <div className={`text-2xl font-bold ${getStreakStatus().color}`}>
                    {userStats.currentStreak} days
                  </div>
                  <div className={`text-xs ${getStreakStatus().color}`}>
                    {getStreakStatus().message}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-4 border border-purple-500/30"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <span className="text-white/70 text-sm">Play Time</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">
                    {calculateTotalPlayTime()}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl p-4 border border-blue-500/30"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="w-5 h-5 text-blue-400" />
                    <span className="text-white/70 text-sm">Achievements</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">
                    {achievements.filter(a => a.claimed).length}
                  </div>
                </motion.div>
              </div>

              {/* Game Performance Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 rounded-xl p-6 border border-white/10"
              >
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <BarChart className="w-5 h-5 mr-2 text-blue-400" />
                  Game Performance
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="gameType" 
                        stroke="#9CA3AF"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="averageScore" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Game Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/5 rounded-xl p-6 border border-white/10"
                >
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-green-400" />
                    Games Played Distribution
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={performanceData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="gamesPlayed"
                          label={({ value, name }) => {
                            const total = performanceData.reduce((sum, item) => sum + item.gamesPlayed, 0);
                            const percentage = value && total > 0 ? ((Number(value) / total) * 100).toFixed(0) : '0';
                            return `${name}: ${percentage}%`;
                          }}
                        >
                          {performanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Detailed Game Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/5 rounded-xl p-6 border border-white/10"
                >
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Gamepad2 className="w-5 h-5 mr-2 text-purple-400" />
                    Game Details
                  </h3>
                  <div className="space-y-3">
                    {performanceData.map((game, index) => (
                      <div
                        key={game.gameType}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">
                            {getGameIcon(game.gameType)}
                          </div>
                          <div>
                            <div className="font-medium text-white capitalize">
                              {game.gameType.replace('_', ' ')}
                            </div>
                            <div className="text-sm text-white/60">
                              {game.gamesPlayed} games • {Math.round(game.winRate)}% win rate
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-white">
                            {game.bestScore}
                          </div>
                          <div className="text-sm text-green-400">
                            {game.totalEarnings} HP
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Recent Achievements */}
              {achievements.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white/5 rounded-xl p-6 border border-white/10"
                >
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Medal className="w-5 h-5 mr-2 text-yellow-400" />
                    Recent Achievements
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.slice(0, 6).map((achievement, index) => (
                      <div
                        key={achievement.achievementId}
                        className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg border border-yellow-500/30"
                      >
                        <Crown className="w-6 h-6 text-yellow-400" />
                        <div>
                          <div className="font-medium text-white">
                            Achievement #{index + 1}
                          </div>
                          <div className="text-sm text-white/60">
                            {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="text-center text-white/60 py-8">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No user data available</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}