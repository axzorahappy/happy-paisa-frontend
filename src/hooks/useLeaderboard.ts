import { useState, useEffect, useCallback, useRef } from 'react';
import { leaderboardAPI } from '../services/leaderboardAPI';
import { 
  LeaderboardUser, 
  LeaderboardTimeframe, 
  GameType, 
  LeaderboardCache,
  UserStatsSummary,
  BonusReward
} from '../types/leaderboard';

interface UseLeaderboardOptions {
  timeframe?: LeaderboardTimeframe;
  gameFilter?: GameType;
  enableRealTime?: boolean;
  cacheTimeout?: number; // in milliseconds
  autoRefresh?: number; // in milliseconds
}

interface UseLeaderboardReturn {
  // Data
  leaderboardData: LeaderboardUser[];
  userStats: UserStatsSummary | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  refetch: () => Promise<void>;
  updateFilters: (timeframe: LeaderboardTimeframe, gameFilter: GameType) => void;
  awardBonuses: () => Promise<BonusReward[]>;
  
  // Real-time status
  isConnected: boolean;
  lastUpdated: number;
}

const CACHE_KEY_PREFIX = 'leaderboard_cache_';
const DEFAULT_CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const DEFAULT_AUTO_REFRESH = 30 * 1000; // 30 seconds

export function useLeaderboard(options: UseLeaderboardOptions = {}): UseLeaderboardReturn {
  const {
    timeframe = 'weekly',
    gameFilter = 'all',
    enableRealTime = true,
    cacheTimeout = DEFAULT_CACHE_TIMEOUT,
    autoRefresh = DEFAULT_AUTO_REFRESH,
  } = options;

  // State
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [userStats, setUserStats] = useState<UserStatsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  
  // Refs
  const wsCleanupRef = useRef<(() => void) | null>(null);
  const autoRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentTimeframeRef = useRef(timeframe);
  const currentGameFilterRef = useRef(gameFilter);

  // Cache management
  const getCacheKey = useCallback((tf: LeaderboardTimeframe, gf: GameType) => {
    return `${CACHE_KEY_PREFIX}${tf}_${gf}`;
  }, []);

  const getCachedData = useCallback((tf: LeaderboardTimeframe, gf: GameType): LeaderboardUser[] | null => {
    try {
      const cacheKey = getCacheKey(tf, gf);
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const cacheData: LeaderboardCache = JSON.parse(cached);
      const now = Date.now();
      
      if (now - cacheData.lastUpdated > cacheTimeout) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return cacheData.data;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  }, [getCacheKey, cacheTimeout]);

  const setCachedData = useCallback((
    data: LeaderboardUser[], 
    tf: LeaderboardTimeframe, 
    gf: GameType
  ) => {
    try {
      const cacheKey = getCacheKey(tf, gf);
      const cacheData: LeaderboardCache = {
        data,
        timeframe: tf,
        gameFilter: gf,
        lastUpdated: Date.now(),
        version: 1,
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }, [getCacheKey]);

  // Fetch leaderboard data
  const fetchLeaderboardData = useCallback(async (
    tf: LeaderboardTimeframe, 
    gf: GameType, 
    useCache = true
  ) => {
    try {
      setError(null);
      
      // Try cache first if enabled
      if (useCache) {
        const cachedData = getCachedData(tf, gf);
        if (cachedData) {
          setLeaderboardData(cachedData);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      const data = await leaderboardAPI.getLeaderboard(tf, gf);
      
      setLeaderboardData(data);
      setCachedData(data, tf, gf);
      setLastUpdated(Date.now());
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
      console.error('Leaderboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [getCachedData, setCachedData]);

  // Fetch user stats
  const fetchUserStats = useCallback(async () => {
    try {
      const stats = await leaderboardAPI.getUserStats();
      // For now, we'll handle the type mismatch by checking if stats exists
      if (stats) {
        // Transform LeaderboardUser to UserStatsSummary format
        const transformedStats: UserStatsSummary = {
          userId: stats.id,
          username: stats.username,
          overallRank: stats.rank,
          gameStats: {}, // Will be populated by real API
          achievements: [],
          currentStreak: stats.streakCount || 0,
          longestStreak: stats.streakCount || 0,
          totalPlayTime: 0,
          joinedAt: Date.now(),
          lastActiveAt: stats.lastActive || Date.now(),
        };
        setUserStats(transformedStats);
      }
    } catch (err) {
      console.error('User stats fetch error:', err);
    }
  }, []);

  // Update filters
  const updateFilters = useCallback((newTimeframe: LeaderboardTimeframe, newGameFilter: GameType) => {
    currentTimeframeRef.current = newTimeframe;
    currentGameFilterRef.current = newGameFilter;
    fetchLeaderboardData(newTimeframe, newGameFilter);
  }, [fetchLeaderboardData]);

  // Manual refetch
  const refetch = useCallback(async () => {
    await fetchLeaderboardData(currentTimeframeRef.current, currentGameFilterRef.current, false);
    await fetchUserStats();
  }, [fetchLeaderboardData, fetchUserStats]);

  // Award bonuses
  const awardBonuses = useCallback(async (): Promise<BonusReward[]> => {
    try {
      const rewards = await leaderboardAPI.awardBonusRewards(currentTimeframeRef.current);
      // Refetch data after awarding bonuses
      await refetch();
      return rewards;
    } catch (error) {
      console.error('Failed to award bonuses:', error);
      return [];
    }
  }, [refetch]);

  // Real-time WebSocket connection
  useEffect(() => {
    if (!enableRealTime) return;

    const connectWebSocket = () => {
      try {
        const cleanup = leaderboardAPI.subscribeToUpdates((updatedData: LeaderboardUser[]) => {
          setLeaderboardData(updatedData);
          setCachedData(updatedData, currentTimeframeRef.current, currentGameFilterRef.current);
          setLastUpdated(Date.now());
          setIsConnected(true);
        });

        wsCleanupRef.current = cleanup;
        setIsConnected(true);

        // Handle connection loss and retry
        const retryInterval = setInterval(() => {
          if (!isConnected) {
            console.log('Attempting to reconnect WebSocket...');
            connectWebSocket();
          }
        }, 10000); // Retry every 10 seconds

        return () => {
          clearInterval(retryInterval);
          if (cleanup) cleanup();
        };
      } catch (error) {
        console.error('WebSocket connection error:', error);
        setIsConnected(false);
      }
    };

    const cleanup = connectWebSocket();
    return cleanup;
  }, [enableRealTime, setCachedData]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (!loading && !isConnected) {
        fetchLeaderboardData(currentTimeframeRef.current, currentGameFilterRef.current, false);
      }
    }, autoRefresh);

    autoRefreshIntervalRef.current = interval;
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, fetchLeaderboardData, loading, isConnected]);

  // Initial data fetch
  useEffect(() => {
    fetchLeaderboardData(timeframe, gameFilter);
    fetchUserStats();
  }, []); // Only run once on mount

  // Update current refs when props change
  useEffect(() => {
    if (currentTimeframeRef.current !== timeframe || currentGameFilterRef.current !== gameFilter) {
      updateFilters(timeframe, gameFilter);
    }
  }, [timeframe, gameFilter, updateFilters]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsCleanupRef.current) {
        wsCleanupRef.current();
      }
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
      }
    };
  }, []);

  return {
    // Data
    leaderboardData,
    userStats,
    loading,
    error,
    
    // Actions
    refetch,
    updateFilters,
    awardBonuses,
    
    // Real-time status
    isConnected,
    lastUpdated,
  };
}

// Additional hook for user-specific leaderboard operations
export function useUserLeaderboardStats(userId?: string) {
  const [userStats, setUserStats] = useState<UserStatsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserStats = useCallback(async (id?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const stats = await leaderboardAPI.getUserStats(id);
      // For now, we'll handle the type mismatch by checking if stats exists
      if (stats) {
        // Transform LeaderboardUser to UserStatsSummary format
        const transformedStats: UserStatsSummary = {
          userId: stats.id,
          username: stats.username,
          overallRank: stats.rank,
          gameStats: {}, // Will be populated by real API
          achievements: [],
          currentStreak: stats.streakCount || 0,
          longestStreak: stats.streakCount || 0,
          totalPlayTime: 0,
          joinedAt: Date.now(),
          lastActiveAt: stats.lastActive || Date.now(),
        };
        setUserStats(transformedStats);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserStats(userId);
  }, [userId, fetchUserStats]);

  return {
    userStats,
    loading,
    error,
    refetch: () => fetchUserStats(userId),
  };
}