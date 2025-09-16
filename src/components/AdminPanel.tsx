import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Users,
  Trophy,
  BarChart3,
  RefreshCw,
  Trash2,
  Plus,
  Edit3,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Coins,
  Award,
  Target,
  Activity,
  TrendingUp,
  Clock,
  Database,
  Shield,
  Download,
  Upload
} from 'lucide-react';
import { leaderboardAPI } from '../services/leaderboardAPI';
import { 
  LeaderboardUser, 
  LeaderboardConfig, 
  LeaderboardAnalytics,
  LeaderboardTimeframe,
  BonusReward,
  Achievement 
} from '../types/leaderboard';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
}

interface AdminAction {
  id: string;
  type: 'reset' | 'bonus' | 'config' | 'user';
  description: string;
  timestamp: number;
  status: 'success' | 'error' | 'pending';
}

export default function AdminPanel({ isOpen, onClose, isAdmin }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'config' | 'analytics' | 'actions'>('overview');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [analytics, setAnalytics] = useState<LeaderboardAnalytics | null>(null);
  const [config, setConfig] = useState<LeaderboardConfig | null>(null);
  const [recentActions, setRecentActions] = useState<AdminAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<{
    action: string;
    timeframe?: LeaderboardTimeframe;
    callback: () => void;
  } | null>(null);

  // Form states
  const [editingConfig, setEditingConfig] = useState(false);
  const [tempConfig, setTempConfig] = useState<LeaderboardConfig | null>(null);

  useEffect(() => {
    if (isOpen && isAdmin) {
      fetchAdminData();
    }
  }, [isOpen, isAdmin]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch leaderboard data
      const leaderboard = await leaderboardAPI.getLeaderboard('weekly', 'all');
      setLeaderboardData(leaderboard);

      // Fetch analytics
      const analyticsData = await leaderboardAPI.getLeaderboardAnalytics('weekly');
      setAnalytics(analyticsData);

      // Mock config data - in real app would come from API
      const mockConfig: LeaderboardConfig = {
        bonusRewards: { 1: 1000, 2: 500, 3: 250 },
        resetSchedule: {
          daily: '0 0 * * *',
          weekly: '0 0 * * 0',
          monthly: '0 0 1 * *'
        },
        achievementMultipliers: {
          common: 1,
          rare: 1.5,
          epic: 2,
          legendary: 3
        },
        minimumGamesForRanking: 5,
        maxLeaderboardSize: 100,
        enableRealTimeUpdates: true
      };
      setConfig(mockConfig);
      setTempConfig(mockConfig);

      // Mock recent actions
      const mockActions: AdminAction[] = [
        {
          id: '1',
          type: 'bonus',
          description: 'Weekly bonuses awarded to top 3 players',
          timestamp: Date.now() - 3600000,
          status: 'success'
        },
        {
          id: '2',
          type: 'reset',
          description: 'Daily leaderboard reset',
          timestamp: Date.now() - 86400000,
          status: 'success'
        }
      ];
      setRecentActions(mockActions);

    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetLeaderboard = async (timeframe: LeaderboardTimeframe) => {
    try {
      setLoading(true);
      await leaderboardAPI.resetLeaderboard(timeframe);
      
      const action: AdminAction = {
        id: Date.now().toString(),
        type: 'reset',
        description: `${timeframe} leaderboard reset`,
        timestamp: Date.now(),
        status: 'success'
      };
      setRecentActions(prev => [action, ...prev].slice(0, 10));
      
      // Refresh data
      await fetchAdminData();
    } catch (error) {
      console.error('Reset failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAwardBonuses = async (timeframe: LeaderboardTimeframe) => {
    try {
      setLoading(true);
      const rewards = await leaderboardAPI.awardBonusRewards(timeframe);
      
      const action: AdminAction = {
        id: Date.now().toString(),
        type: 'bonus',
        description: `Bonuses awarded: ${rewards.length} recipients`,
        timestamp: Date.now(),
        status: 'success'
      };
      setRecentActions(prev => [action, ...prev].slice(0, 10));
      
      await fetchAdminData();
    } catch (error) {
      console.error('Award bonuses failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!tempConfig) return;
    
    try {
      setLoading(true);
      // In real app, would save to API
      setConfig(tempConfig);
      setEditingConfig(false);
      
      const action: AdminAction = {
        id: Date.now().toString(),
        type: 'config',
        description: 'Leaderboard configuration updated',
        timestamp: Date.now(),
        status: 'success'
      };
      setRecentActions(prev => [action, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Save config failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const data = {
      leaderboard: leaderboardData,
      analytics: analytics,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leaderboard-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen || !isAdmin) return null;

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
        className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-xl border border-white/10 w-full max-w-7xl max-h-[95vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-red-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
              <p className="text-white/70">Leaderboard management and analytics</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={exportData}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </motion.button>
            
            <motion.button
              onClick={fetchAdminData}
              disabled={loading}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </motion.button>
            
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 px-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'config', label: 'Configuration', icon: Settings },
            { id: 'analytics', label: 'Analytics', icon: Activity },
            { id: 'actions', label: 'Recent Actions', icon: Clock }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-500 text-white'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-160px)] p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-4 border border-blue-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-white/70 text-sm">Total Users</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">
                    {analytics?.totalUsers?.toLocaleString() || '0'}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl p-4 border border-green-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    <span className="text-white/70 text-sm">Active Players</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    {analytics?.userEngagement?.dailyActiveUsers?.toLocaleString() || '0'}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-4 border border-purple-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Trophy className="w-5 h-5 text-purple-400" />
                    <span className="text-white/70 text-sm">Games Played</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">
                    {analytics?.totalGames?.toLocaleString() || '0'}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 rounded-xl p-4 border border-yellow-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Coins className="w-5 h-5 text-yellow-400" />
                    <span className="text-white/70 text-sm">Rewards Awarded</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {analytics?.totalRewardsAwarded?.toLocaleString() || '0'}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(['daily', 'weekly', 'monthly'] as LeaderboardTimeframe[]).map((timeframe) => (
                    <div key={timeframe} className="space-y-2">
                      <button
                        onClick={() => setShowConfirmDialog({
                          action: `Award ${timeframe} bonuses`,
                          timeframe,
                          callback: () => handleAwardBonuses(timeframe)
                        })}
                        className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Award {timeframe} bonuses
                      </button>
                      <button
                        onClick={() => setShowConfirmDialog({
                          action: `Reset ${timeframe} leaderboard`,
                          timeframe,
                          callback: () => handleResetLeaderboard(timeframe)
                        })}
                        className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Reset {timeframe}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Players */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Top 10 Players</h3>
                <div className="space-y-2">
                  {leaderboardData.slice(0, 10).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg font-bold text-white">#{user.rank}</div>
                        <div>
                          <div className="font-medium text-white">{user.username}</div>
                          <div className="text-sm text-white/60">{user.gamesPlayed} games played</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white">{user.totalScore.toLocaleString()}</div>
                        <div className="text-sm text-green-400">{user.totalEarnings} HP</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'config' && config && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Leaderboard Configuration</h3>
                <div className="flex items-center space-x-2">
                  {editingConfig ? (
                    <>
                      <button
                        onClick={() => {
                          setTempConfig(config);
                          setEditingConfig(false);
                        }}
                        className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveConfig}
                        className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditingConfig(true)}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bonus Rewards */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-4">Bonus Rewards</h4>
                  <div className="space-y-3">
                    {Object.entries(tempConfig?.bonusRewards || {}).map(([rank, reward]) => (
                      <div key={rank} className="flex items-center justify-between">
                        <span className="text-white/70">Rank #{rank}</span>
                        {editingConfig ? (
                          <input
                            type="number"
                            value={reward}
                            onChange={(e) => setTempConfig(prev => prev ? {
                              ...prev,
                              bonusRewards: { ...prev.bonusRewards, [rank]: parseInt(e.target.value) }
                            } : null)}
                            className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white"
                          />
                        ) : (
                          <span className="text-green-400 font-bold">{reward} HP</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* General Settings */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-4">General Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Min Games for Ranking</span>
                      {editingConfig ? (
                        <input
                          type="number"
                          value={tempConfig?.minimumGamesForRanking || 0}
                          onChange={(e) => setTempConfig(prev => prev ? {
                            ...prev,
                            minimumGamesForRanking: parseInt(e.target.value)
                          } : null)}
                          className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white"
                        />
                      ) : (
                        <span className="text-white">{config.minimumGamesForRanking}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Max Leaderboard Size</span>
                      {editingConfig ? (
                        <input
                          type="number"
                          value={tempConfig?.maxLeaderboardSize || 0}
                          onChange={(e) => setTempConfig(prev => prev ? {
                            ...prev,
                            maxLeaderboardSize: parseInt(e.target.value)
                          } : null)}
                          className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white"
                        />
                      ) : (
                        <span className="text-white">{config.maxLeaderboardSize}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Real-time Updates</span>
                      {editingConfig ? (
                        <button
                          onClick={() => setTempConfig(prev => prev ? {
                            ...prev,
                            enableRealTimeUpdates: !prev.enableRealTimeUpdates
                          } : null)}
                          className={`px-3 py-1 rounded ${
                            tempConfig?.enableRealTimeUpdates
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-600 text-white/60'
                          }`}
                        >
                          {tempConfig?.enableRealTimeUpdates ? 'Enabled' : 'Disabled'}
                        </button>
                      ) : (
                        <span className={config.enableRealTimeUpdates ? 'text-green-400' : 'text-red-400'}>
                          {config.enableRealTimeUpdates ? 'Enabled' : 'Disabled'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Recent Administrative Actions</h3>
              <div className="space-y-3">
                {recentActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        action.status === 'success' ? 'bg-green-400' :
                        action.status === 'error' ? 'bg-red-400' : 'bg-yellow-400'
                      }`} />
                      <div>
                        <div className="font-medium text-white">{action.description}</div>
                        <div className="text-sm text-white/60">
                          {new Date(action.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="capitalize text-white/70">{action.type}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Dialog */}
        <AnimatePresence>
          {showConfirmDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-slate-800 rounded-xl p-6 border border-white/10 max-w-md w-full mx-4"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Confirm Action</h3>
                </div>
                <p className="text-white/70 mb-6">
                  Are you sure you want to {showConfirmDialog.action}? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowConfirmDialog(null)}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      showConfirmDialog.callback();
                      setShowConfirmDialog(null);
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}