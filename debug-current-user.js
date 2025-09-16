import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugCurrentUser() {
  try {
    console.log('🔍 Checking current authentication state...\n');
    
    // Check current session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError);
      return;
    }
    
    if (!sessionData.session) {
      console.log('❌ No active session found. User is not signed in.');
      return;
    }
    
    console.log('✅ Active session found!');
    console.log('User ID:', sessionData.session.user.id);
    console.log('Email:', sessionData.session.user.email);
    console.log('Created at:', sessionData.session.user.created_at);
    console.log('Email confirmed:', sessionData.session.user.email_confirmed_at ? 'Yes' : 'No');
    
    if (sessionData.session.user.user_metadata) {
      console.log('User metadata:', sessionData.session.user.user_metadata);
    }
    
    console.log('\n🔍 Checking user profile in database...\n');
    
    // Check user profile in database
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', sessionData.session.user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Profile error:', profileError);
      if (profileError.code === 'PGRST116') {
        console.log('💡 Profile does not exist in database. This might be the issue!');
      }
      return;
    }
    
    console.log('✅ Profile found in database:');
    console.log('- ID:', profileData.id);
    console.log('- Email:', profileData.email);
    console.log('- Username:', profileData.username);
    console.log('- Balance:', profileData.balance);
    console.log('- Total Earned:', profileData.total_earned);
    console.log('- Games Played:', profileData.games_played);
    console.log('- Avatar URL:', profileData.avatar_url || '(none)');
    console.log('- Created:', profileData.created_at);
    console.log('- Updated:', profileData.updated_at);
    
    // Check if username looks like demo data
    if (profileData.username.includes('Demo') || profileData.username === 'Happy Paisa Demo User') {
      console.log('\n⚠️  WARNING: Username contains "Demo" - this might be the issue!');
    }
    
    console.log('\n✅ Debug completed. Check the username field above.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

debugCurrentUser();