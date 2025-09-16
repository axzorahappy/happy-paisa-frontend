import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAbhiseoProfile() {
  try {
    console.log('🔍 Checking profile for abhiseohyd@gmail.com...\n');
    
    // Find the user profile by email
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', 'abhiseohyd@gmail.com');
    
    if (error) {
      console.error('❌ Error fetching profile:', error);
      return;
    }
    
    if (profiles.length === 0) {
      console.log('❌ No profile found for abhiseohyd@gmail.com');
      console.log('💡 This explains why Profile is None in the debug panel');
    } else {
      console.log('✅ Profile found:');
      const profile = profiles[0];
      console.log('- ID:', profile.id);
      console.log('- Email:', profile.email);
      console.log('- Username:', profile.username);
      console.log('- Balance:', profile.balance);
      console.log('- Created:', profile.created_at);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkAbhiseoProfile();