import { LeaderboardUser, LeaderboardTimeframe, GameStats, BonusReward } from '../types/leaderboard';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export class LeaderboardAPI {
  private static instance: LeaderboardAPI;
  private authToken: string | null = null;

  private constructor() {
    // Get auth token from localStorage or context
    this.authToken = localStorage.getItem('authToken');
  }

  public static getInstance(): LeaderboardAPI {
    if (!LeaderboardAPI.instance) {
      LeaderboardAPI.instance = new LeaderboardAPI();
    }
    return LeaderboardAPI.instance;
  }

  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` }),
      ...options?.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Fetch leaderboard data with filters
  async getLeaderboard(
    timeframe: LeaderboardTimeframe = 'weekly',
    gameFilter: string = 'all',
    limit: number = 50
  ): Promise<LeaderboardUser[]> {
    const params = new URLSearchParams({
      timeframe,
      game: gameFilter,
      limit: limit.toString(),
    });

    try {
      return await this.makeRequest<LeaderboardUser[]>(`/leaderboard?${params}`);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      // Return mock data as fallback
      return this.getMockLeaderboardData();
    }
  }

  // Get user's current ranking and stats
  async getUserStats(userId?: string): Promise<LeaderboardUser | null> {
    try {
      const endpoint = userId ? `/leaderboard/user/${userId}` : '/leaderboard/me';
      return await this.makeRequest<LeaderboardUser>(endpoint);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      return null;
    }
  }

  // Update user's game statistics
  async updateUserStats(gameStats: GameStats): Promise<boolean> {
    try {
      await this.makeRequest('/leaderboard/stats', {
        method: 'POST',
        body: JSON.stringify(gameStats),
      });
      return true;
    } catch (error) {
      console.error('Failed to update user stats:', error);
      return false;
    }
  }

  // Award bonus rewards to top players
  async awardBonusRewards(timeframe: LeaderboardTimeframe): Promise<BonusReward[]> {
    try {
      return await this.makeRequest<BonusReward[]>('/leaderboard/award-bonuses', {
        method: 'POST',
        body: JSON.stringify({ timeframe }),
      });
    } catch (error) {
      console.error('Failed to award bonus rewards:', error);
      return [];
    }
  }

  // Get leaderboard analytics
  async getLeaderboardAnalytics(timeframe: LeaderboardTimeframe): Promise<any> {
    try {
      return await this.makeRequest(`/leaderboard/analytics?timeframe=${timeframe}`);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      return null;
    }
  }

  // Reset leaderboard for a specific timeframe (admin only)
  async resetLeaderboard(timeframe: LeaderboardTimeframe): Promise<boolean> {
    try {
      await this.makeRequest('/leaderboard/reset', {
        method: 'POST',
        body: JSON.stringify({ timeframe }),
      });
      return true;
    } catch (error) {
      console.error('Failed to reset leaderboard:', error);
      return false;
    }
  }

  // Get user achievements
  async getUserAchievements(userId?: string): Promise<any[]> {
    try {
      const endpoint = userId ? `/achievements/${userId}` : '/achievements/me';
      return await this.makeRequest<any[]>(endpoint);
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
      return [];
    }
  }

  // Subscribe to real-time leaderboard updates
  subscribeToUpdates(callback: (data: LeaderboardUser[]) => void): () => void {
    // WebSocket implementation for real-time updates
    const ws = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/leaderboard/updates`);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        callback(data);
      } catch (error) {
        console.error('Error parsing WebSocket data:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Return cleanup function
    return () => {
      ws.close();
    };
  }

  // Mock data fallback
  private getMockLeaderboardData(): LeaderboardUser[] {
    return [
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
        isCurrentUser: false,
        achievements: ['high_scorer', 'game_master'],
        lastActive: Date.now() - 3600000, // 1 hour ago
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
        isCurrentUser: false,
        achievements: ['math_genius', 'speed_demon'],
        lastActive: Date.now() - 1800000, // 30 minutes ago
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
        isCurrentUser: false,
        achievements: ['memory_master', 'consistent_player'],
        lastActive: Date.now() - 7200000, // 2 hours ago
      },
      {
        id: '4',
        username: 'You',
        avatar: '',
        totalScore: 11850,
        totalEarnings: 6500,
        gamesPlayed: 28,
        bestGame: 'Word Puzzle',
        bestScore: 165,
        rank: 5,
        rankChange: 'new',
        isCurrentUser: true,
        achievements: ['newcomer', 'word_wizard'],
        lastActive: Date.now(),
      }
    ];
  }
}

// Export singleton instance
export const leaderboardAPI = LeaderboardAPI.getInstance();