import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugSupabaseSetup() {
  try {
    console.log('🔍 Debugging Supabase Setup...\n');
    
    console.log('📊 Environment Variables:');
    console.log('- SUPABASE_URL:', supabaseUrl);
    console.log('- SUPABASE_KEY:', supabaseKey.substring(0, 20) + '...\n');
    
    // Test basic connection
    console.log('🌐 Testing Supabase Connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Connection failed:', connectionError.message);
      if (connectionError.message.includes('relation "public.user_profiles" does not exist')) {
        console.log('\n💡 The user_profiles table does not exist in your Supabase database!');
        console.log('You need to run the SQL setup script in your Supabase SQL Editor.');
        console.log('Check the file: supabase-setup.sql');
      }
      return;
    }
    
    console.log('✅ Successfully connected to Supabase!\n');
    
    // Check if tables exist
    console.log('📋 Checking Database Tables...');
    
    const tables = ['user_profiles', 'game_scores', 'wallet_transactions'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table "${table}": ${error.message}`);
        } else {
          console.log(`✅ Table "${table}": Exists`);
        }
      } catch (err) {
        console.log(`❌ Table "${table}": Error - ${err.message}`);
      }
    }
    
    // Check user profiles count
    console.log('\n👥 User Profiles in Database:');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, email, username, created_at');
    
    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError.message);
    } else {
      console.log(`Found ${profiles.length} user profiles:`);
      profiles.forEach((profile, index) => {
        console.log(`${index + 1}. ${profile.username} (${profile.email}) - Created: ${profile.created_at}`);
      });
    }
    
    // Check current session (this might be empty since we're running outside browser)
    console.log('\n🔐 Current Session Status:');
    const { data: session } = await supabase.auth.getSession();
    if (session.session) {
      console.log('✅ Active session found');
      console.log('User ID:', session.session.user.id);
      console.log('Email:', session.session.user.email);
    } else {
      console.log('❌ No active session (this is expected when running outside browser)');
    }
    
    console.log('\n✅ Supabase debug completed!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

debugSupabaseSetup();