// Core leaderboard types
export type LeaderboardTimeframe = 'daily' | 'weekly' | 'monthly' | 'alltime';
export type RankChange = 'up' | 'down' | 'same' | 'new';
export type GameType = 'clicker' | 'memory' | 'math' | 'snake' | 'word' | 'all';

// Enhanced LeaderboardUser interface
export interface LeaderboardUser {
  id: string;
  username: string;
  avatar?: string;
  totalScore: number;
  totalEarnings: number;
  gamesPlayed: number;
  bestGame: string;
  bestScore: number;
  rank: number;
  rankChange: RankChange;
  isCurrentUser?: boolean;
  achievements?: string[];
  lastActive: number;
  streakCount?: number;
  winRate?: number;
  averageScore?: number;
  favoriteGame?: string;
  level?: number;
  experience?: number;
}

// Game statistics for tracking user performance
export interface GameStats {
  userId: string;
  gameType: GameType;
  score: number;
  duration: number; // in seconds
  difficulty?: 'easy' | 'medium' | 'hard';
  multiplier?: number;
  bonus?: number;
  perfectGame?: boolean;
  timestamp: number;
  sessionId?: string;
}

// Enhanced bonus reward system
export interface BonusReward {
  id: string;
  userId: string;
  username: string;
  rank: number;
  amount: number;
  timeframe: LeaderboardTimeframe;
  awardedAt: number;
  type: 'ranking' | 'achievement' | 'streak' | 'milestone';
  description?: string;
}

// Achievement system
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'performance' | 'consistency' | 'milestone' | 'special';
  requirement: {
    type: 'score' | 'games_played' | 'streak' | 'earnings' | 'time';
    value: number;
    gameType?: GameType;
  };
  reward: number; // Happy Paisa reward
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: number;
}

// User achievements tracking
export interface UserAchievement {
  achievementId: string;
  userId: string;
  unlockedAt: number;
  progress?: number;
  maxProgress?: number;
  claimed: boolean;
}

// Leaderboard analytics data
export interface LeaderboardAnalytics {
  timeframe: LeaderboardTimeframe;
  totalUsers: number;
  totalGames: number;
  totalRewardsAwarded: number;
  averageScore: number;
  mostPopularGame: string;
  topScorer: {
    username: string;
    score: number;
  };
  gameDistribution: {
    [key in GameType]?: number;
  };
  userEngagement: {
    dailyActiveUsers: number;
    averageSessionTime: number;
    retentionRate: number;
  };
  trends: {
    date: string;
    activeUsers: number;
    gamesPlayed: number;
    rewardsEarned: number;
  }[];
}

// Real-time leaderboard update events
export interface LeaderboardUpdateEvent {
  type: 'user_score_update' | 'ranking_change' | 'new_achievement' | 'bonus_awarded';
  userId: string;
  data: any;
  timestamp: number;
}

// Leaderboard configuration for admins
export interface LeaderboardConfig {
  bonusRewards: {
    [rank: number]: number;
  };
  resetSchedule: {
    daily: string; // cron expression
    weekly: string;
    monthly: string;
  };
  achievementMultipliers: {
    [rarity in Achievement['rarity']]: number;
  };
  minimumGamesForRanking: number;
  maxLeaderboardSize: number;
  enableRealTimeUpdates: boolean;
}

// Leaderboard filters and sorting
export interface LeaderboardFilters {
  timeframe: LeaderboardTimeframe;
  gameType: GameType;
  userLevel?: number;
  minGamesPlayed?: number;
  sortBy: 'totalScore' | 'totalEarnings' | 'winRate' | 'averageScore';
  sortOrder: 'asc' | 'desc';
  limit: number;
  offset: number;
}

// User statistics summary
export interface UserStatsSummary {
  userId: string;
  username: string;
  overallRank: number;
  gameStats: {
    [gameType: string]: {
      gamesPlayed: number;
      bestScore: number;
      averageScore: number;
      totalEarnings: number;
      winRate: number;
      personalBest: {
        score: number;
        achievedAt: number;
      };
    };
  };
  achievements: UserAchievement[];
  currentStreak: number;
  longestStreak: number;
  totalPlayTime: number;
  joinedAt: number;
  lastActiveAt: number;
}

// Leaderboard cache structure
export interface LeaderboardCache {
  data: LeaderboardUser[];
  timeframe: LeaderboardTimeframe;
  gameFilter: GameType;
  lastUpdated: number;
  version: number;
}

// API response types
export interface LeaderboardResponse {
  success: boolean;
  data: LeaderboardUser[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  metadata?: {
    timeframe: LeaderboardTimeframe;
    gameFilter: GameType;
    lastUpdated: number;
  };
}

export interface BonusRewardResponse {
  success: boolean;
  rewards: BonusReward[];
  totalAwarded: number;
  message: string;
}

// WebSocket message types for real-time updates
export interface WebSocketMessage {
  type: 'leaderboard_update' | 'user_achievement' | 'bonus_awarded' | 'rank_change';
  payload: any;
  timestamp: number;
}

// Seasonal events and special competitions
export interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  startDate: number;
  endDate: number;
  gameTypes: GameType[];
  specialRewards: {
    [rank: number]: {
      happyPaisa: number;
      specialItems?: string[];
      badges?: string[];
    };
  };
  theme: {
    backgroundColor: string;
    accentColor: string;
    icon: string;
  };
  isActive: boolean;
  participantCount: number;
}