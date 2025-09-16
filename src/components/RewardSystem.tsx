import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Trophy,
  Crown,
  Zap,
  Gift,
  Coins,
  Award,
  Target,
  Calendar,
  Sparkles,
  Medal,
  Flame,
  Lock,
  Unlock,
  Clock
} from 'lucide-react';
import { Achievement, UserAchievement, BonusReward, SeasonalEvent } from '../types/leaderboard';

interface RewardSystemProps {
  isOpen: boolean;
  onClose: () => void;
  userAchievements: UserAchievement[];
  onClaimReward: (achievementId: string, reward: number) => void;
}

// Mock achievements data - in real app would come from backend
const mockAchievements: Achievement[] = [
  {
    id: 'first_win',
    name: 'First Victory',
    description: 'Win your first game',
    icon: '🏆',
    category: 'milestone',
    requirement: { type: 'games_played', value: 1 },
    reward: 100,
    rarity: 'common'
  },
  {
    id: 'high_scorer',
    name: 'High Scorer',
    description: 'Score over 1000 points in any game',
    icon: '🎯',
    category: 'performance',
    requirement: { type: 'score', value: 1000 },
    reward: 250,
    rarity: 'rare'
  },
  {
    id: 'math_genius',
    name: 'Math Genius',
    description: 'Score over 150 points in Math Quiz',
    icon: '🧮',
    category: 'performance',
    requirement: { type: 'score', value: 150, gameType: 'math' },
    reward: 300,
    rarity: 'rare'
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a game in under 30 seconds',
    icon: '⚡',
    category: 'performance',
    requirement: { type: 'time', value: 30 },
    reward: 200,
    rarity: 'rare'
  },
  {
    id: 'dedicated_player',
    name: 'Dedicated Player',
    description: 'Play games for 7 days in a row',
    icon: '📅',
    category: 'consistency',
    requirement: { type: 'streak', value: 7 },
    reward: 500,
    rarity: 'epic'
  },
  {
    id: 'game_master',
    name: 'Game Master',
    description: 'Play 100 games total',
    icon: '👑',
    category: 'milestone',
    requirement: { type: 'games_played', value: 100 },
    reward: 1000,
    rarity: 'epic'
  },
  {
    id: 'millionaire',
    name: 'Happy Paisa Millionaire',
    description: 'Earn 10,000 Happy Paisa',
    icon: '💎',
    category: 'milestone',
    requirement: { type: 'earnings', value: 10000 },
    reward: 2000,
    rarity: 'legendary'
  }
];

// Mock seasonal event
const currentSeasonalEvent: SeasonalEvent = {
  id: 'winter_wonderland_2024',
  name: 'Winter Wonderland',
  description: 'Special winter event with bonus rewards!',
  startDate: Date.now() - 7 * 24 * 60 * 60 * 1000, // Started 7 days ago
  endDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // Ends in 7 days
  gameTypes: ['all'],
  specialRewards: {
    1: { happyPaisa: 2000, specialItems: ['Winter Crown'], badges: ['Winter Champion'] },
    2: { happyPaisa: 1000, specialItems: ['Ice Trophy'], badges: ['Winter Runner-up'] },
    3: { happyPaisa: 500, specialItems: ['Snow Medal'], badges: ['Winter Bronze'] }
  },
  theme: {
    backgroundColor: 'from-blue-900 via-purple-900 to-indigo-900',
    accentColor: '#60A5FA',
    icon: '❄️'
  },
  isActive: true,
  participantCount: 1247
};

export default function RewardSystem({ isOpen, onClose, userAchievements, onClaimReward }: RewardSystemProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'milestone' | 'performance' | 'consistency' | 'special'>('all');
  const [showClaimAnimation, setShowClaimAnimation] = useState<string | null>(null);
  const [currentEvent] = useState<SeasonalEvent>(currentSeasonalEvent);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-500 bg-gray-500/10 text-gray-300';
      case 'rare': return 'border-blue-500 bg-blue-500/10 text-blue-300';
      case 'epic': return 'border-purple-500 bg-purple-500/10 text-purple-300';
      case 'legendary': return 'border-yellow-500 bg-yellow-500/10 text-yellow-300';
      default: return 'border-gray-500 bg-gray-500/10 text-gray-300';
    }
  };

  const getRarityIcon = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return <Star className="w-4 h-4" />;
      case 'rare': return <Medal className="w-4 h-4" />;
      case 'epic': return <Crown className="w-4 h-4" />;
      case 'legendary': return <Sparkles className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'milestone': return <Target className="w-4 h-4" />;
      case 'performance': return <Trophy className="w-4 h-4" />;
      case 'consistency': return <Calendar className="w-4 h-4" />;
      case 'special': return <Gift className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const isAchievementUnlocked = (achievementId: string) => {
    return userAchievements.some(ua => ua.achievementId === achievementId && ua.unlockedAt > 0);
  };

  const isAchievementClaimed = (achievementId: string) => {
    return userAchievements.some(ua => ua.achievementId === achievementId && ua.claimed);
  };

  const getAchievementProgress = (achievementId: string) => {
    const userAchievement = userAchievements.find(ua => ua.achievementId === achievementId);
    if (!userAchievement || !userAchievement.progress || !userAchievement.maxProgress) {
      return 0;
    }
    return (userAchievement.progress / userAchievement.maxProgress) * 100;
  };

  const handleClaimReward = async (achievement: Achievement) => {
    if (!isAchievementUnlocked(achievement.id) || isAchievementClaimed(achievement.id)) {
      return;
    }

    setShowClaimAnimation(achievement.id);
    onClaimReward(achievement.id, achievement.reward);
    
    setTimeout(() => setShowClaimAnimation(null), 2000);
  };

  const filteredAchievements = mockAchievements.filter(achievement => 
    selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const unlockedCount = mockAchievements.filter(a => isAchievementUnlocked(a.id)).length;
  const claimedCount = mockAchievements.filter(a => isAchievementClaimed(a.id)).length;
  const totalRewards = mockAchievements
    .filter(a => isAchievementClaimed(a.id))
    .reduce((total, a) => total + a.reward, 0);

  const daysLeft = Math.ceil((currentEvent.endDate - Date.now()) / (1000 * 60 * 60 * 24));

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
            <Gift className="w-8 h-8 text-yellow-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Rewards & Achievements</h2>
              <p className="text-white/70">Unlock rewards by completing achievements</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-white/60">Total Earned</div>
              <div className="text-xl font-bold text-green-400 flex items-center">
                <Coins className="w-5 h-5 mr-1" />
                {totalRewards.toLocaleString()}
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
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-80px)] p-6">
          {/* Seasonal Event Banner */}
          {currentEvent.isActive && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-gradient-to-r ${currentEvent.theme.backgroundColor} rounded-xl p-6 mb-6 border border-blue-500/30`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{currentEvent.theme.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{currentEvent.name}</h3>
                    <p className="text-white/70">{currentEvent.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-white/60">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{daysLeft} days left</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Flame className="w-4 h-4" />
                        <span>{currentEvent.participantCount.toLocaleString()} participants</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">Special Rewards</div>
                  <div className="space-y-1 text-sm">
                    <div className="text-yellow-400">🥇 2,000 HP + Winter Crown</div>
                    <div className="text-gray-400">🥈 1,000 HP + Ice Trophy</div>
                    <div className="text-amber-600">🥉 500 HP + Snow Medal</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{mockAchievements.length}</div>
              <div className="text-sm text-white/60">Total Achievements</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{unlockedCount}</div>
              <div className="text-sm text-white/60">Unlocked</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{claimedCount}</div>
              <div className="text-sm text-white/60">Claimed</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {Math.round((claimedCount / mockAchievements.length) * 100)}%
              </div>
              <div className="text-sm text-white/60">Completion</div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['all', 'milestone', 'performance', 'consistency', 'special'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(category as Achievement['category'])}
                  <span className="capitalize">{category}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map((achievement) => {
              const unlocked = isAchievementUnlocked(achievement.id);
              const claimed = isAchievementClaimed(achievement.id);
              const progress = getAchievementProgress(achievement.id);
              const isAnimating = showClaimAnimation === achievement.id;

              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`relative rounded-xl p-4 border-2 transition-all ${
                    claimed
                      ? 'bg-green-500/10 border-green-500/50'
                      : unlocked
                      ? getRarityColor(achievement.rarity)
                      : 'bg-gray-500/5 border-gray-500/30'
                  }`}
                >
                  {/* Rarity Badge */}
                  <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${getRarityColor(achievement.rarity)}`}>
                    {getRarityIcon(achievement.rarity)}
                  </div>

                  {/* Achievement Icon */}
                  <div className="text-center mb-3">
                    <div className={`text-4xl mb-2 ${!unlocked ? 'grayscale' : ''}`}>
                      {achievement.icon}
                    </div>
                    <h3 className={`font-bold ${unlocked ? 'text-white' : 'text-white/40'}`}>
                      {achievement.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className={`text-sm text-center mb-4 ${unlocked ? 'text-white/70' : 'text-white/40'}`}>
                    {achievement.description}
                  </p>

                  {/* Progress Bar */}
                  {!unlocked && progress > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-white/60 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <motion.div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Reward & Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-green-400">
                      <Coins className="w-4 h-4" />
                      <span className="font-bold">{achievement.reward}</span>
                    </div>

                    {claimed ? (
                      <div className="flex items-center space-x-1 text-green-400">
                        <Unlock className="w-4 h-4" />
                        <span className="text-sm">Claimed</span>
                      </div>
                    ) : unlocked ? (
                      <motion.button
                        onClick={() => handleClaimReward(achievement)}
                        className="px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm rounded-lg hover:opacity-90 transition-opacity"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isAnimating}
                      >
                        Claim
                      </motion.button>
                    ) : (
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm">Locked</span>
                      </div>
                    )}
                  </div>

                  {/* Claim Animation */}
                  <AnimatePresence>
                    {isAnimating && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute inset-0 bg-green-500/20 rounded-xl flex items-center justify-center"
                      >
                        <div className="text-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.5, repeat: 3 }}
                            className="text-4xl mb-2"
                          >
                            🎉
                          </motion.div>
                          <div className="text-green-400 font-bold">
                            +{achievement.reward} HP Claimed!
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}