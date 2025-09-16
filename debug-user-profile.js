import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserProfile() {
  try {
    const userId = '97c65e10-bbcf-48db-8ca1-880cb7f5174b';
    const email = 'arjunali.2025@gmail.com';
    
    console.log('🔍 Checking for user profile...');
    console.log('User ID:', userId);
    console.log('Email:', email);
    console.log('');
    
    // Check if profile exists
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.log('❌ Profile not found:', error.message);
      
      if (error.code === 'PGRST116') {
        console.log('💡 User profile does not exist in database.');
        console.log('');
        console.log('🔧 Creating profile manually...');
        
        // Create the missing profile
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            id: userId,
            email: email,
            username: email.split('@')[0], // Use email prefix as username
            balance: 1000,
            total_earned: 0,
            games_played: 0
          })
          .select()
          .single();
        
        if (createError) {
          console.error('❌ Failed to create profile:', createError.message);
        } else {
          console.log('✅ Profile created successfully!');
          console.log('New profile:', newProfile);
        }
      }
    } else {
      console.log('✅ Profile found:');
      console.log(profile);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkUserProfile();