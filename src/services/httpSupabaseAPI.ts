// HTTP-based Supabase API to replace the problematic JavaScript client
import type { User, Session } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vnbnzyszoibyaruujnok.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuYm56eXN6b2lieWFydXVqbm9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NzMxODEsImV4cCI6MjA3MzM0OTE4MX0.yYaCKSS6dQgAEw7U-Mgr3_P6yxJi0V-zHIPSa-lf3jE';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  balance: number;
  total_earned: number;
  games_played: number;
  happy_coins?: number;
  staked_amount?: number;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  type: 'earned' | 'spent' | 'bonus' | 'refund';
  amount: number;
  description: string;
  game_type?: string;
  created_at: string;
}

export interface CoinPackage {
  id: string;
  name: string;
  description: string;
  happy_coins: number;
  price_usd: number;
  price_eur: number;
  price_inr: number;
  is_popular: boolean;
  is_active: boolean;
}

export interface WalletLedgerEntry {
  id: string;
  user_id: string;
  type: 'purchase' | 'stake' | 'unstake' | 'reward' | 'conversion' | 'bonus';
  happy_coins: number;
  happy_paisa: number;
  description: string;
  reference_id?: string;
  created_at: string;
}

export interface StakingPosition {
  id: string;
  user_id: string;
  happy_coins: number;
  apy_rate: number;
  duration_days: number;
  status: 'active' | 'completed' | 'cancelled';
  staked_at: string;
  matures_at: string;
  claimed_at?: string;
  reward_amount: number;
}

export interface WalletBalances {
  happyCoins: number;
  happyPaisa: number;
  stakedAmount: number;
  totalEarned: number;
}

class HttpSupabaseAPI {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${SUPABASE_URL}/rest/v1${endpoint}`;
    
    const headers = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...options.headers
    };
    
    console.log('🌐 HttpSupabaseAPI: Making request to:', url);
    console.log('🌐 HttpSupabaseAPI: Request options:', { method: options.method, headers });
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    console.log('🌐 HttpSupabaseAPI: Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ HttpSupabaseAPI: HTTP Error:', {
        status: response.status,
        statusText: response.statusText,
        errorText,
        url
      });
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    if (response.status === 204) {
      return null; // No content
    }
    
    return await response.json();
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    console.log('🌐 HttpSupabaseAPI: Getting user profile for:', userId);
    
    const data = await this.makeRequest(`/user_profiles?id=eq.${userId}&select=*`, {
      method: 'GET'
    });
    
    if (!data || data.length === 0) {
      throw new Error('Profile not found');
    }
    
    console.log('🌐 HttpSupabaseAPI: Profile retrieved:', data[0]);
    return data[0];
  }

  async getWalletBalance(userId?: string): Promise<{ balance: number; totalEarned: number }> {
    if (!userId) {
      // For now, we'll need the userId to be passed in
      throw new Error('User ID required for wallet balance');
    }
    
    console.log('🌍 HttpSupabaseAPI: Getting wallet balance for:', userId);
    
    const data = await this.makeRequest(`/user_profiles?id=eq.${userId}&select=balance,total_earned`, {
      method: 'GET'
    });
    
    if (!data || data.length === 0) {
      throw new Error('Profile not found');
    }
    
    return {
      balance: data[0].balance,
      totalEarned: data[0].total_earned
    };
  }
  
  async getWalletBalances(userId: string): Promise<WalletBalances> {
    console.log('🌍 HttpSupabaseAPI: Getting wallet balances for:', userId);
    
    const data = await this.makeRequest(`/user_profiles?id=eq.${userId}&select=balance,total_earned,happy_coins,staked_amount`, {
      method: 'GET'
    });
    
    if (!data || data.length === 0) {
      throw new Error('Profile not found');
    }
    
    return {
      happyCoins: data[0].happy_coins || 0,
      happyPaisa: data[0].balance || 0,
      stakedAmount: data[0].staked_amount || 0,
      totalEarned: data[0].total_earned || 0
    };
  }
  
  async getCoinPackages(): Promise<CoinPackage[]> {
    console.log('🌍 HttpSupabaseAPI: Getting coin packages');
    
    const data = await this.makeRequest('/coin_packages?is_active=eq.true&order=happy_coins.asc', {
      method: 'GET'
    });
    
    return data || [];
  }
  
  async getWalletLedger(userId: string, limit: number = 20): Promise<WalletLedgerEntry[]> {
    console.log('🌍 HttpSupabaseAPI: Getting wallet ledger for:', userId);
    
    const data = await this.makeRequest(`/wallet_ledger?user_id=eq.${userId}&order=created_at.desc&limit=${limit}`, {
      method: 'GET'
    });
    
    return data || [];
  }
  
  async convertHappyPaisaToCoins(userId: string, happyPaisaAmount: number): Promise<{ success: boolean; hcGained: number }> {
    console.log('🌍 HttpSupabaseAPI: Converting Happy Paisa to HC for:', userId, happyPaisaAmount);
    
    const conversionRate = 0.001; // 1000 Happy Paisa = 1 HC
    const hcGained = happyPaisaAmount * conversionRate;
    
    // First check if user has enough Happy Paisa
    const profile = await this.getUserProfile(userId);
    if (profile.balance < happyPaisaAmount) {
      throw new Error('Insufficient Happy Paisa balance');
    }
    
    // Update user profile - reduce Happy Paisa, increase Happy Coins
    await this.makeRequest(`/user_profiles?id=eq.${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        balance: profile.balance - happyPaisaAmount,
        happy_coins: (profile.happy_coins || 0) + hcGained,
        updated_at: new Date().toISOString()
      })
    });
    
    // Add ledger entry
    await this.makeRequest('/wallet_ledger', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        type: 'conversion',
        happy_coins: hcGained,
        happy_paisa: -happyPaisaAmount,
        description: `Converted ${happyPaisaAmount.toLocaleString()} Happy Paisa to ${hcGained.toFixed(3)} HC`
      })
    });
    
    return { success: true, hcGained };
  }
  
  async createStakingPosition(userId: string, happyCoins: number, durationDays: number, apyRate: number): Promise<StakingPosition> {
    console.log('🌍 HttpSupabaseAPI: Creating staking position for:', userId, happyCoins, durationDays);
    
    // Check if user has enough Happy Coins
    const profile = await this.getUserProfile(userId);
    if ((profile.happy_coins || 0) < happyCoins) {
      throw new Error('Insufficient Happy Coins for staking');
    }
    
    const now = new Date();
    const maturesAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
    
    // Create staking position
    const stakingData = await this.makeRequest('/staking_positions', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        happy_coins: happyCoins,
        apy_rate: apyRate,
        duration_days: durationDays,
        matures_at: maturesAt.toISOString()
      })
    });
    
    // Update user profile - reduce Happy Coins, increase staked amount
    await this.makeRequest(`/user_profiles?id=eq.${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        happy_coins: (profile.happy_coins || 0) - happyCoins,
        staked_amount: (profile.staked_amount || 0) + happyCoins,
        updated_at: new Date().toISOString()
      })
    });
    
    // Add ledger entry
    await this.makeRequest('/wallet_ledger', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        type: 'stake',
        happy_coins: -happyCoins,
        description: `Staked ${happyCoins} HC for ${durationDays} days at ${apyRate}% APY`,
        reference_id: stakingData[0].id
      })
    });
    
    return stakingData[0];
  }
  
  async getStakingPositions(userId: string): Promise<StakingPosition[]> {
    console.log('🌍 HttpSupabaseAPI: Getting staking positions for:', userId);
    
    const data = await this.makeRequest(`/staking_positions?user_id=eq.${userId}&order=staked_at.desc`, {
      method: 'GET'
    });
    
    return data || [];
  }

  async getWalletTransactions(userId: string, limit: number = 10): Promise<WalletTransaction[]> {
    console.log('🌐 HttpSupabaseAPI: Getting transactions for:', userId);
    
    const data = await this.makeRequest(`/wallet_transactions?user_id=eq.${userId}&order=created_at.desc&limit=${limit}`, {
      method: 'GET'
    });
    
    return data || [];
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    console.log('🌐 HttpSupabaseAPI: Updating profile for:', userId, updates);
    
    // Clean up the updates object - handle null values
    const cleanUpdates = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    // If avatar_url is null, explicitly set it
    if ('avatar_url' in updates && updates.avatar_url === null) {
      cleanUpdates.avatar_url = undefined;
    }
    
    console.log('🌐 HttpSupabaseAPI: Clean updates:', cleanUpdates);
    
    const data = await this.makeRequest(`/user_profiles?id=eq.${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(cleanUpdates)
    });
    
    if (!data || data.length === 0) {
      throw new Error('Profile update failed - no data returned');
    }
    
    console.log('✅ HttpSupabaseAPI: Profile updated successfully:', data[0]);
    return data[0];
  }

  async uploadProfileImage(userId: string, file: File): Promise<string> {
    console.log('🌐 HttpSupabaseAPI: Uploading profile image for:', userId);
    
    // For now, we'll convert the image to base64 and store it as a data URL
    // In a production app, you'd upload to Supabase Storage
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        console.log('✅ HttpSupabaseAPI: Image converted to base64');
        resolve(base64String);
      };
      reader.onerror = () => {
        console.error('❌ HttpSupabaseAPI: Error reading image file');
        reject(new Error('Failed to read image file'));
      };
      reader.readAsDataURL(file);
    });
  }
}

export const httpSupabaseAPI = new HttpSupabaseAPI();