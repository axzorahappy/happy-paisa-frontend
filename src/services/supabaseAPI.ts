// Supabase Real Mode API Service for Happy Paisa
import { getSupabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

// Types
export interface UserProfile {
  id: string
  email: string
  username: string
  avatar_url?: string
  balance: number
  total_earned: number
  games_played: number
  created_at: string
  updated_at: string
}

export interface GameScore {
  id?: string
  user_id: string
  game_type: 'clicker' | 'memory' | 'math' | 'snake' | 'word'
  score: number
  reward: number
  time_spent: number
  created_at?: string
}

export interface WalletTransaction {
  id: string
  user_id: string
  type: 'earned' | 'spent' | 'bonus' | 'refund'
  amount: number
  description: string
  game_type?: string
  created_at: string
}

export interface LeaderboardEntry {
  id: string
  username: string
  avatar_url?: string
  total_score: number
  total_earned: number
  games_played: number
  rank?: number
  created_at: string
}

// Supabase API Service Class
export class SupabaseHappyPaisaAPI {
  private supabase

  constructor() {
    this.supabase = getSupabase()
  }

  // Authentication Methods
  async signUp(email: string, password: string, username?: string) {
    if (!this.supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://happypaisa.com/auth/callback',
        data: {
          username: username || email.split('@')[0]
        }
      }
    })
    
    if (error) throw error
    
    // Don't create user profile immediately - it will be created by the trigger
    // when the user confirms their email and signs in for the first time
    
    return data
  }

  async signIn(email: string, password: string) {
    if (!this.supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  }

  async signOut() {
    if (!this.supabase) throw new Error('Supabase not configured')
    
    const { error } = await this.supabase.auth.signOut()
    if (error) throw error
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.supabase) return null
    
    const { data: { user } } = await this.supabase.auth.getUser()
    return user
  }

  async getSession(): Promise<Session | null> {
    if (!this.supabase) return null
    
    const { data: { session } } = await this.supabase.auth.getSession()
    return session
  }

  // User Profile Methods
  async createUserProfile(userId: string, profileData: Partial<UserProfile>) {
    if (!this.supabase) throw new Error('Supabase not configured')
    
    const profile = {
      id: userId,
      balance: 1000, // Starting balance
      total_earned: 0,
      games_played: 0,
      ...profileData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await this.supabase
      .from('User')
      .insert([profile])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getUserProfile(userId?: string): Promise<UserProfile> {
    if (!this.supabase) throw new Error('Supabase not configured')
    
    if (!userId) {
      const user = await this.getCurrentUser()
      if (!user) throw new Error('Not authenticated')
      userId = user.id
    }
    
    const { data, error } = await this.supabase
      .from('User')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const user = await this.getCurrentUser()
        if (user) {
          return await this.createUserProfile(userId, {
            email: user.email || '',
            username: user.user_metadata?.username || user.email?.split('@')[0] || 'User'
          })
        }
      }
      throw error
    }
    
    return data
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    if (!this.supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await this.supabase
      .from('User')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Game Score Methods
  async submitGameScore(gameData: Omit<GameScore, 'id' | 'user_id' | 'reward' | 'created_at'>): Promise<{ reward: number; newBalance: number }> {
    if (!this.supabase) throw new Error('Supabase not configured')
    
    const user = await this.getCurrentUser()
    if (!user) throw new Error('Not authenticated')
    
    // Calculate reward based on score and game type
    const baseReward = this.calculateReward(gameData.game_type, gameData.score)
    
    // Insert game score
    const { data: scoreData, error: scoreError } = await this.supabase
      .from('game_scores')
      .insert([{
        user_id: user.id,
        ...gameData,
        reward: baseReward,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (scoreError) throw scoreError
    
    // Update user profile
    const profile = await this.getUserProfile(user.id)
    const newBalance = profile.balance + baseReward
    const newTotalEarned = profile.total_earned + baseReward
    const newGamesPlayed = profile.games_played + 1
    
    await this.updateUserProfile(user.id, {
      balance: newBalance,
      total_earned: newTotalEarned,
      games_played: newGamesPlayed
    })
    
    // Create transaction record
    await this.createTransaction({
      user_id: user.id,
      type: 'earned',
      amount: baseReward,
      description: `${gameData.game_type} game reward - Score: ${gameData.score}`,
      game_type: gameData.game_type
    })
    
    return {
      reward: baseReward,
      newBalance
    }
  }

  private calculateReward(gameType: string, score: number): number {
    const baseRewards = {
      clicker: 100,
      memory: 150,
      math: 200,
      snake: 250,
      word: 180
    }
    
    const baseReward = baseRewards[gameType as keyof typeof baseRewards] || 100
    const multiplier = Math.min(score / 100, 2) // Max 2x multiplier
    return Math.floor(baseReward * multiplier)
  }

  // Wallet Methods
  async getWalletBalance(userId?: string): Promise<{ balance: number; totalEarned: number }> {
    const profile = await this.getUserProfile(userId)
    return {
      balance: profile.balance,
      totalEarned: profile.total_earned
    }
  }

  async createTransaction(transactionData: Omit<WalletTransaction, 'id' | 'created_at'>): Promise<WalletTransaction> {
    if (!this.supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await this.supabase
      .from('wallet_transactions')
      .insert([{
        ...transactionData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getWalletTransactions(userId?: string, limit: number = 10): Promise<WalletTransaction[]> {
    if (!this.supabase) throw new Error('Supabase not configured')
    
    if (!userId) {
      const user = await this.getCurrentUser()
      if (!user) throw new Error('Not authenticated')
      userId = user.id
    }
    
    const { data, error } = await this.supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data || []
  }

  async convertCoins(userId: string, amount: number): Promise<{ success: boolean; newBalance: number }> {
    if (!this.supabase) throw new Error('Supabase not configured')
    
    const profile = await this.getUserProfile(userId)
    
    if (profile.balance < amount) {
      throw new Error('Insufficient balance')
    }
    
    const newBalance = profile.balance - amount
    
    await this.updateUserProfile(userId, { balance: newBalance })
    
    // Create conversion transaction
    await this.createTransaction({
      user_id: userId,
      type: 'spent',
      amount,
      description: `Converted ${amount} HP to cash`
    })
    
    return {
      success: true,
      newBalance
    }
  }

  // Leaderboard Methods
  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    if (!this.supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('id, username, avatar_url, total_earned, games_played, created_at')
      .order('total_earned', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    
    return (data || []).map((user, index) => ({
      ...user,
      rank: index + 1,
      total_score: user.total_earned // Using total_earned as score
    }))
  }

  // Utility Methods
  isSupabaseConfigured(): boolean {
    return !!this.supabase
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    if (!this.supabase) return { data: { subscription: { unsubscribe: () => {} } } }
    
    return this.supabase.auth.onAuthStateChange(callback)
  }
}

// Create singleton instance
export const supabaseAPI = new SupabaseHappyPaisaAPI()

// Helper hooks
export const useSupabaseAuth = () => {
  return {
    signUp: supabaseAPI.signUp.bind(supabaseAPI),
    signIn: supabaseAPI.signIn.bind(supabaseAPI),
    signOut: supabaseAPI.signOut.bind(supabaseAPI),
    getCurrentUser: supabaseAPI.getCurrentUser.bind(supabaseAPI),
    getSession: supabaseAPI.getSession.bind(supabaseAPI),
    onAuthStateChange: supabaseAPI.onAuthStateChange.bind(supabaseAPI)
  }
}

export const useSupabaseWallet = () => {
  return {
    getBalance: supabaseAPI.getWalletBalance.bind(supabaseAPI),
    getTransactions: supabaseAPI.getWalletTransactions.bind(supabaseAPI),
    convertCoins: supabaseAPI.convertCoins.bind(supabaseAPI)
  }
}

export const useSupabaseGames = () => {
  return {
    submitScore: supabaseAPI.submitGameScore.bind(supabaseAPI),
    getLeaderboard: supabaseAPI.getLeaderboard.bind(supabaseAPI)
  }
}