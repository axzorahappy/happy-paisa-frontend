// Happy Paisa Production API Service
import { getSupabase } from '../lib/supabase'

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://vnbnzyszoibyaruujnok.supabase.co/functions/v1/happy-paisa-api'

// Types
export interface User {
  id: string
  email?: string
  name?: string
  role?: 'USER' | 'ADMIN'
  status?: 'ACTIVE' | 'SUSPENDED' | 'DELETED'
  createdAt?: string
}

export interface UserProfile {
  user: User
  balances: {
    rewards: number
    coins: number
  }
}

export interface Game {
  id: string
  title: string
  description: string
  reward: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  externalUrl?: string
}

export interface GameSession {
  sessionId: string
  requiredDuration: number
  externalUrl: string
  callbackUrl: string
}

export interface RewardEvent {
  id: string
  userId: string
  gameId?: string
  delta: number
  reason: 'GAME_REWARD' | 'ADJUSTMENT'
  createdAt: string
}

export interface StakingPosition {
  id: string
  userId: string
  stakedAmount: number
  rewardAmount: number
  lockupEndsAt: string
  status: 'STAKED' | 'UNSTAKED_EARLY' | 'REWARD_PAID'
  createdAt: string
}

export interface ConversionResult {
  balances: {
    rewards: number
    coins: number
  }
  conversion: {
    rewardsSpent: number
    coinsCredited: number
  }
}

// API Client Class
class HappyPaisaAPI {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    // Get auth headers
    const headers = await this.getAuthHeaders(options.headers)
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...options.headers
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API Error (${response.status}): ${errorText}`)
    }

    return response.json()
  }

  private async getAuthHeaders(existingHeaders?: HeadersInit): Promise<Record<string, string>> {
    const headers: Record<string, string> = {}
    
    const supabase = getSupabase()
    if (supabase) {
      try {
        const { data } = await supabase.auth.getSession()
        const token = data.session?.access_token
        const userId = data.session?.user?.id
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
        
        // Fallback for development
        if (userId) {
          headers['x-user-id'] = userId
        }
      } catch (error) {
        console.warn('Auth headers error:', error)
      }
    }
    
    return headers
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; gameCount: number; version: string; uptime: number }> {
    return this.makeRequest('/api/health')
  }

  // User Methods
  async getCurrentUser(): Promise<UserProfile> {
    return this.makeRequest('/api/me')
  }

  // Game Methods
  async getGames(): Promise<{ games: Game[] }> {
    return this.makeRequest('/api/games')
  }

  async getGame(gameId: string): Promise<{ game: Game }> {
    return this.makeRequest(`/api/games/${gameId}`)
  }

  async startGame(gameId: string): Promise<GameSession> {
    return this.makeRequest(`/api/games/${gameId}/start`, {
      method: 'POST'
    })
  }

  async claimGameReward(gameId: string, sessionId: string): Promise<{ ok: boolean; rewards: number; added: number }> {
    return this.makeRequest(`/api/games/${gameId}/claim`, {
      method: 'POST',
      body: JSON.stringify({ sessionId })
    })
  }

  async getInstantReward(gameId: string): Promise<{ ok: boolean; rewards: number; added: number }> {
    return this.makeRequest(`/api/games/${gameId}/reward`, {
      method: 'POST'
    })
  }

  // Rewards Methods
  async getRewards(): Promise<{ balance: number; events: RewardEvent[] }> {
    return this.makeRequest('/api/rewards')
  }

  async convertRewardsToCoins(rewardsToSpend: number): Promise<ConversionResult> {
    return this.makeRequest('/api/rewards/convert', {
      method: 'POST',
      body: JSON.stringify({ rewardsToSpend })
    })
  }

  async getCoinPackages(): Promise<any[]> {
    return this.makeRequest('/api/rewards/packages')
  }

  // Staking Methods
  async stakeCoins(amount: number): Promise<StakingPosition> {
    return this.makeRequest('/api/staking', {
      method: 'POST',
      body: JSON.stringify({ amount })
    })
  }

  async getStakingHistory(): Promise<StakingPosition[]> {
    return this.makeRequest('/api/staking/history')
  }

  // Payment Methods
  async createCheckout(packageCoins?: number, customCoins?: number): Promise<{ url: string }> {
    return this.makeRequest('/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ packageCoins, customCoins })
    })
  }

  // AI Methods
  async completeText(prompt: string, maxTokens = 512): Promise<{ content: string }> {
    return this.makeRequest('/api/ai/complete', {
      method: 'POST',
      body: JSON.stringify({ prompt, maxTokens })
    })
  }

  async chatCompletion(messages: any[]): Promise<{ content: string }> {
    return this.makeRequest('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ messages })
    })
  }

  // Admin Methods (require admin role)
  async getUsers(): Promise<User[]> {
    return this.makeRequest('/admin/users')
  }

  async getUserDetails(userId: string): Promise<UserProfile> {
    return this.makeRequest(`/admin/users/${userId}`)
  }

  async updateUserStatus(userId: string, status: 'ACTIVE' | 'SUSPENDED' | 'DELETED'): Promise<User> {
    return this.makeRequest(`/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    })
  }

  async createGame(game: Omit<Game, 'id'>): Promise<Game> {
    return this.makeRequest('/admin/games', {
      method: 'POST',
      body: JSON.stringify(game)
    })
  }

  async updateGame(gameId: string, updates: Partial<Game>): Promise<Game> {
    return this.makeRequest(`/admin/games/${gameId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    })
  }

  async deleteGame(gameId: string): Promise<{ success: boolean }> {
    return this.makeRequest(`/admin/games/${gameId}`, {
      method: 'DELETE'
    })
  }
}

// Export singleton instance
export const api = new HappyPaisaAPI()
