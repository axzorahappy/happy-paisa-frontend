// Test Frontend Signup Fix
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('🧪 Testing Fixed Signup Process')
console.log('=' * 35)

const supabase = createClient(supabaseUrl, supabaseKey)

async function testFixedSignup() {
  try {
    console.log('🔐 Testing fixed signup flow...')
    
    const testEmail = `fixed_test_${Date.now()}@happypaisa.com`
    const testPassword = 'TestPassword123!'
    
    console.log('📧 Email:', testEmail)
    console.log('⏳ Starting signup...')
    
    const startTime = Date.now()
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          username: 'FixedTestUser'
        }
      }
    })
    
    const endTime = Date.now()
    console.log(`⚡ Signup completed in ${endTime - startTime}ms`)
    
    if (error) {
      console.log('❌ Error:', error.message)
    } else {
      console.log('✅ Signup successful!')
      console.log('📝 User created:', !!data.user)
      console.log('🔗 Session:', data.session ? 'Created' : 'Pending confirmation')
      
      if (!data.session) {
        console.log('📬 Email confirmation required - this is normal!')
      }
    }
    
  } catch (err) {
    console.error('💥 Unexpected error:', err)
  }
}

testFixedSignup()