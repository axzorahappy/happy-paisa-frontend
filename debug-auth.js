// Authentication Debug Tool
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('🔍 Authentication Debug Tool')
console.log('=' * 40)

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugAuth() {
  try {
    console.log('🔐 Checking current session...')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.log('❌ Session Error:', sessionError.message)
      return
    }
    
    console.log('📝 Session Status:', session ? '✅ Active' : '❌ None')
    
    if (session) {
      console.log('👤 User ID:', session.user.id)
      console.log('📧 Email:', session.user.email)
      console.log('🕒 Expires:', new Date(session.expires_at * 1000).toLocaleString())
      
      // Check if user profile exists
      console.log('')
      console.log('🔍 Checking user profile...')
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      if (profileError) {
        if (profileError.code === 'PGRST116') {
          console.log('⚠️ Profile not found - needs to be created')
        } else {
          console.log('❌ Profile Error:', profileError.message)
        }
      } else {
        console.log('✅ Profile found:', profile.username, '- Balance:', profile.balance)
      }
    }
    
    // List all users (for debugging)
    console.log('')
    console.log('👥 All user profiles in database:')
    const { data: allProfiles, error: allError } = await supabase
      .from('user_profiles')
      .select('id, username, email, created_at')
      .limit(5)
    
    if (allError) {
      console.log('❌ Error fetching profiles:', allError.message)
    } else {
      if (allProfiles.length === 0) {
        console.log('📭 No profiles found')
      } else {
        allProfiles.forEach(p => {
          console.log(`  • ${p.username} (${p.email}) - Created: ${new Date(p.created_at).toLocaleDateString()}`)
        })
      }
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error.message)
  }
}

debugAuth()