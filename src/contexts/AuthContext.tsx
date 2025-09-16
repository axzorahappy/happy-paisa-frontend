// Supabase Authentication Context for Happy Paisa
import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabaseAPI } from '../services/supabaseAPI'
import { httpSupabaseAPI, UserProfile } from '../services/httpSupabaseAPI'

interface AuthContextType {
  // Auth state
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  isAuthenticated: boolean
  
  // Auth methods
  signUp: (email: string, password: string, username?: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  
  // Profile methods
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabaseAPI.onAuthStateChange(
      async (event, session) => {
console.log('Auth state changed:', event, session?.user?.email)
        setSession(session)
        setUser(session?.user || null)
        
        if (session?.user) {
console.log('Loading profile for user:', session.user.id)
          await loadUserProfile(session.user.id)
        } else {
console.log('No user, clearing profile')
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const initializeAuth = async () => {
    try {
console.log('Initializing auth...')
      const session = await supabaseAPI.getSession()
console.log('Session:', session ? 'Found' : 'Not found')
      setSession(session)
      setUser(session?.user || null)
      
      if (session?.user) {
console.log('User found, loading profile for:', session.user.id)
        await loadUserProfile(session.user.id)
      } else {
console.log('No user found in session')
      }
    } catch (error) {
console.error('Error initializing auth:', error)
    } finally {
console.log('Auth initialization complete')
      setLoading(false)
    }
  }

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('🔍 Loading profile for user (HTTP):', userId)
      // Use HTTP-based API instead of problematic Supabase client
      const userProfile = await httpSupabaseAPI.getUserProfile(userId)
      console.log('✅ Profile loaded successfully (HTTP):', {
        id: userProfile.id,
        username: userProfile.username,
        email: userProfile.email,
        balance: userProfile.balance
      })
      setProfile(userProfile)
    } catch (error: any) {
      console.error('❌ Error loading user profile (HTTP):', error)
      console.error('❌ Error details:', {
        message: error.message
      })
      // Set profile to null on error to avoid infinite loading
      setProfile(null)
    }
  }

  const signUp = async (email: string, password: string, username?: string) => {
    // Don't set global loading state for signup - let the form handle its own loading
    try {
      const result = await supabaseAPI.signUp(email, password, username)
      return result
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await supabaseAPI.signIn(email, password)
      return result
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    console.log('🚶 Attempting to sign out...')
    setLoading(true)
    try {
      // Try Supabase sign out with timeout
      console.log('💫 Clearing local auth state first...')
      setUser(null)
      setProfile(null)
      setSession(null)
      
      // Try Supabase signOut but don't wait too long
      const signOutPromise = supabaseAPI.signOut()
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 3000))
      
      await Promise.race([signOutPromise, timeoutPromise])
      console.log('✅ Sign out completed (or timed out safely)')
      
    } catch (error) {
      console.error('❌ Sign out error (but local state is cleared):', error)
      // Don't throw error - we've already cleared local state
    } finally {
      setLoading(false)
      console.log('✅ Sign out process finished')
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    if (!user) throw new Error('Not authenticated')
    
    // Use HTTP-based API instead of problematic Supabase client
    const updatedProfile = await httpSupabaseAPI.updateUserProfile(user.id, updates)
    setProfile(updatedProfile)
    return updatedProfile
  }

  const refreshProfile = async () => {
    if (!user) return
    await loadUserProfile(user.id)
  }

  const isAuthenticated = !!user && !!session

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Legacy hook for backward compatibility with existing code
export const useSupabaseAuth = () => {
  const auth = useAuth()
  return {
    getCurrentUser: async () => auth.user,
    getSession: async () => auth.session,
    signUp: auth.signUp,
    signIn: auth.signIn,
    signOut: auth.signOut,
    isAuthenticated: () => auth.isAuthenticated,
    onAuthStateChange: supabaseAPI.onAuthStateChange.bind(supabaseAPI)
  }
}