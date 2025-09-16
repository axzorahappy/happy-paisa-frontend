// Test Supabase Signup Process
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('🧪 Testing Supabase Signup Process')
console.log('=' * 40)
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey?.substring(0, 20) + '...')

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSignup() {
  try {
    console.log('')
    console.log('🔐 Testing signup process...')
    
    // Test with a dummy email
    const testEmail = `test_${Date.now()}@happypaisa.com`
    const testPassword = 'TestPassword123!'
    
    console.log('📧 Test Email:', testEmail)
    console.log('🔒 Test Password:', testPassword)
    console.log('')
    console.log('⏳ Attempting signup...')
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          username: 'TestUser'
        }
      }
    })
    
    if (error) {
      console.log('❌ Signup Error:', error.message)
      console.log('Error Details:', error)
      
      // Check specific error types
      if (error.message.includes('Email rate limit exceeded')) {
        console.log('⚠️  Rate limit hit - try again in a few minutes')
      } else if (error.message.includes('Unable to validate email address')) {
        console.log('⚠️  Email validation issue')
      } else if (error.message.includes('Password')) {
        console.log('⚠️  Password requirements not met')
      }
    } else {
      console.log('✅ Signup successful!')
      console.log('📝 User ID:', data.user?.id)
      console.log('📧 User Email:', data.user?.email)
      console.log('🔗 Session:', data.session ? 'Created' : 'Pending email confirmation')
      
      // Check if email confirmation is required
      if (!data.session) {
        console.log('📬 Email confirmation required')
      }
    }
    
  } catch (err) {
    console.error('💥 Unexpected error:', err)
  }
}

async function checkAuthSettings() {
  console.log('')
  console.log('🔍 Checking auth settings...')
  
  try {
    // Try to get current session
    const { data: { session } } = await supabase.auth.getSession()
    console.log('Current session:', session ? 'Exists' : 'None')
    
    // Check if we can connect to auth
    const { data: { user } } = await supabase.auth.getUser()
    console.log('Auth connection:', user ? 'Connected' : 'Not authenticated')
    
  } catch (error) {
    console.log('❌ Auth check failed:', error.message)
  }
}

// Run tests
checkAuthSettings().then(() => testSignup())