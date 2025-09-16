// Real API Service for Happy Paisa Backend
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://vnbnzyszoibyaruujnok.supabase.co/functions/v1/happy-paisa-api/api'

// Types
export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  balance: number
  totalEarned: number
  gamesPlayed: number
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface GameScore {
  gameType: 'clicker' | 'memory' | 'math' | 'snake' | 'word'
  score: number
  timeSpent: number
  difficulty?: string
}

export interface WalletTransaction {
  id: string
  type: 'earned' | 'spent' | 'bonus' | 'refund'
  amount: number
  description: string
  gameType?: string
  timestamp: string
}

export interface LeaderboardEntry {
  id: string
  username: string
  avatar?: string
  totalScore: number
  totalEarnings: number
  gamesPlayed: number
  rank: number
  rankChange: 'up' | 'down' | 'same' | 'new'
  isCurrentUser?: boolean
}

// API Client Class
export class HappyPaisaAPI {
  private token: string | null = null

  constructor() {
    // Load token from localStorage if available
    this.token = localStorage.getItem('happyPaisaToken')
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed:`, error)
      throw error
    }
  }

  // Authentication Methods
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
    
    this.token = response.token
    localStorage.setItem('happyPaisaToken', response.token)
    
    return response
  }

  async logout(): Promise<void> {
    this.token = null
    localStorage.removeItem('happyPaisaToken')
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/user/profile')
  }

  // Game Methods
  async submitGameScore(gameData: GameScore): Promise<{ reward: number; newBalance: number }> {
    return this.request<{ reward: number; newBalance: number }>('/games/play', {
      method: 'POST',
      body: JSON.stringify(gameData)
    })
  }

  async getLeaderboard(timeframe: 'daily' | 'weekly' | 'monthly' | 'alltime' = 'weekly'): Promise<LeaderboardEntry[]> {
    return this.request<LeaderboardEntry[]>(`/leaderboard?timeframe=${timeframe}`)
  }

  // Wallet Methods
  async getWalletBalance(): Promise<{ balance: number; totalEarned: number }> {
    return this.request<{ balance: number; totalEarned: number }>('/user/wallet')
  }

  async getWalletTransactions(limit: number = 50): Promise<WalletTransaction[]> {
    return this.request<WalletTransaction[]>(`/user/wallet/transactions?limit=${limit}`)
  }

  async convertCoins(amount: number): Promise<{ success: boolean; newBalance: number }> {
    return this.request<{ success: boolean; newBalance: number }>('/wallet/convert', {
      method: 'POST',
      body: JSON.stringify({ amount })
    })
  }

  // Profile Methods
  async updateProfile(profileData: Partial<User>): Promise<User> {
    return this.request<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; uptime: number; gameCount: number; version: string }> {
    return this.request<{ status: string; uptime: number; gameCount: number; version: string }>('/health')
  }

  // Guest/Demo mode for when not authenticated
  async createGuestUser(): Promise<LoginResponse> {
    const guestData = {
      email: `guest_${Date.now()}@happypaisa.demo`,
      password: 'guest123',
      username: `Guest${Math.floor(Math.random() * 1000)}`
    }

    return this.request<LoginResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(guestData)
    })
  }

  isAuthenticated(): boolean {
    return !!this.token
  }
}

// Create a singleton instance
export const api = new HappyPaisaAPI()

// Helper hooks for React components
export const useAuth = () => {
  return {
    login: api.login.bind(api),
    logout: api.logout.bind(api),
    isAuthenticated: api.isAuthenticated.bind(api),
    getCurrentUser: api.getCurrentUser.bind(api)
  }
}

export const useWallet = () => {
  return {
    getBalance: api.getWalletBalance.bind(api),
    getTransactions: api.getWalletTransactions.bind(api),
    convertCoins: api.convertCoins.bind(api)
  }
}

export const useGames = () => {
  return {
    submitScore: api.submitGameScore.bind(api),
    getLeaderboard: api.getLeaderboard.bind(api)
  }
}