import { useState, useEffect } from 'react';

// Define types for the integration
interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    phone?: string;
  };
}

interface GameResult {
  success: boolean;
  reward?: number;
  score?: number;
  error?: string;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  main_balance: number;
  happy_coins: number;
  cashback_balance: number;
  referral_code: string;
}

// Custom hook for Happy Paisa Netlify Integration
export const useHappyPaisa = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeHappyPaisa = async () => {
      // Wait for Netlify Identity to load
      while (!window.netlifyIdentity) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Wait for Supabase to load
      while (!window.HAPPY_PAISA_SUPABASE) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Initialize Netlify Identity
      window.netlifyIdentity.init();

      // Check current user
      const currentUser = window.netlifyIdentity.currentUser();
      if (currentUser) {
        setUser(currentUser);
        await syncUserProfile(currentUser);
      }

      // Set up event listeners
      window.netlifyIdentity.on('login', async (user: User) => {
        setUser(user);
        await syncUserProfile(user);
        showNotification('Welcome back! Signed in successfully.', 'success');
      });

      window.netlifyIdentity.on('signup', async (user: User) => {
        setUser(user);
        await syncUserProfile(user, true);
        showNotification('Account created! Welcome to Happy Paisa!', 'success');
      });

      window.netlifyIdentity.on('logout', () => {
        setUser(null);
        setProfile(null);
        showNotification('Signed out successfully', 'info');
      });

      setIsInitialized(true);
      setIsLoading(false);
    };

    initializeHappyPaisa();
  }, []);

  const syncUserProfile = async (user: User, isNewUser: boolean = false) => {
    try {
      const supabase = window.HAPPY_PAISA_SUPABASE;
      
      // Check if user exists in Supabase
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', user.email)
        .single();

      if (!existingProfile) {
        // Create new user profile
        const newProfile = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email.split('@')[0],
          phone: user.user_metadata?.phone || '',
          main_balance: isNewUser ? 1000.00 : 0,
          happy_coins: isNewUser ? 100 : 0,
          cashback_balance: 0,
          referral_code: generateReferralCode(),
          created_at: new Date().toISOString()
        };

        await supabase.from('user_profiles').insert([newProfile]);

        if (isNewUser) {
          // Record welcome bonus transaction
          await supabase.from('wallet_transactions').insert({
            user_id: user.id,
            type: 'credit',
            amount: 1000,
            transaction_type: 'welcome_bonus',
            description: 'Welcome bonus',
            status: 'completed'
          });

          // Record HP welcome points
          await supabase.from('game_scores').insert({
            user_id: user.id,
            game_type: 'welcome_bonus',
            score: 0,
            coins_earned: 100,
            duration: 0
          });

          // Create welcome notification
          await supabase.from('notifications').insert({
            user_id: user.id,
            title: 'Welcome to Happy Paisa! 🎉',
            message: 'Your account has been created successfully. You received ₹1000 welcome bonus and 100 Happy Paisa points!',
            type: 'success'
          });
        }

        setProfile(newProfile);
      } else {
        setProfile(existingProfile);
      }
    } catch (error) {
      console.error('Profile sync error:', error);
    }
  };

  const generateReferralCode = (): string => {
    return 'HP' + Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const playGame = async (gameType: string, baseReward: number): Promise<GameResult> => {
    if (!user) {
      showNotification('Please sign in to play games!', 'error');
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const supabase = window.HAPPY_PAISA_SUPABASE;
      const reward = baseReward + Math.floor(Math.random() * 50);
      const score = Math.floor(Math.random() * 1000) + 100;

      // Record game score
      await supabase.from('game_scores').insert({
        user_id: user.id,
        game_type: gameType,
        score: score,
        coins_earned: reward,
        duration: Math.floor(Math.random() * 300) + 30
      });

      // Update user's happy coins
      if (profile) {
        const newTotal = (profile.happy_coins || 0) + reward;
        await supabase
          .from('user_profiles')
          .update({ happy_coins: newTotal })
          .eq('id', user.id);

        setProfile(prev => prev ? { ...prev, happy_coins: newTotal } : null);
      }

      // Create notification
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: 'Game Completed! 🎮',
        message: `You earned ${reward} Happy Paisa points playing ${gameType}! Score: ${score}`,
        type: 'success'
      });

      showNotification(`🎮 Earned ${reward} HP points! Score: ${score}`, 'success');

      return { success: true, reward, score };
    } catch (error) {
      console.error('Game play error:', error);
      showNotification('Game error. Please try again.', 'error');
      return { success: false, error: 'Game play failed' };
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    // Create notification element
    const notification = document.createElement('div');
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500'
    };

    notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-4 py-2 rounded-lg shadow-lg z-50 max-w-sm`;
    notification.innerHTML = `
      <div class="flex items-center justify-between">
        <p class="text-sm font-medium">${message}</p>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">×</button>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  };

  const login = () => {
    if (window.netlifyIdentity) {
      window.netlifyIdentity.open('login');
    }
  };

  const signup = () => {
    if (window.netlifyIdentity) {
      window.netlifyIdentity.open('signup');
    }
  };

  const logout = () => {
    if (window.netlifyIdentity) {
      window.netlifyIdentity.logout();
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await syncUserProfile(user);
    }
  };

  return {
    user,
    profile,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    playGame,
    refreshProfile,
    showNotification
  };
};

// Extend window type for TypeScript
declare global {
  interface Window {
    netlifyIdentity: {
      init: () => void;
      currentUser: () => User | null;
      on: (event: string, callback: (user?: User) => void) => void;
      open: (mode: 'login' | 'signup') => void;
      logout: () => void;
    };
    HAPPY_PAISA_SUPABASE: any;
  }
}

export default useHappyPaisa;