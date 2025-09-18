import { createClient, SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function getSupabase() {
  if (client) {
    console.log('✅ getSupabase: Returning existing client')
    return client
  }
  
  const url = import.meta.env.VITE_SUPABASE_URL
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  console.log('🔍 getSupabase: Environment check:')
  console.log('- VITE_SUPABASE_URL:', url ? 'Found' : 'Missing')
  console.log('- VITE_SUPABASE_ANON_KEY:', anon ? 'Found' : 'Missing')
  
  if (url && anon) {
    console.log('🚀 getSupabase: Creating Supabase client...')
    try {
      client = createClient(url, anon, {
        db: {
          schema: 'public'
        },
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        },
        global: {
          headers: {
            'X-Client-Info': 'happy-paisa-frontend'
          }
        },
        realtime: {
          params: {
            eventsPerSecond: 2
          }
        }
      })
      console.log('✅ getSupabase: Client created successfully')
    } catch (error) {
      console.error('❌ getSupabase: Error creating client:', error)
    }
  } else {
    console.error('❌ getSupabase: Missing environment variables!')
  }
  
  // Make available globally for Happy Paisa integration
  if (typeof window !== 'undefined' && client) {
    window.HAPPY_PAISA_SUPABASE = client;
    console.log('✅ Happy Paisa Supabase client available globally');
  }
  
  return client
}

// Happy Paisa Types
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  main_balance: number;
  happy_coins: number;
  cashback_balance: number;
  referral_code: string;
  created_at: string;
}

export interface GameScore {
  id: string;
  user_id: string;
  game_type: string;
  score: number;
  coins_earned: number;
  duration: number;
  created_at: string;
}

// Global type extension for Happy Paisa
declare global {
  interface Window {
    HAPPY_PAISA_SUPABASE: any;
    netlifyIdentity: any;
  }
}

