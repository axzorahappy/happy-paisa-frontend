-- SQL to manually create the missing user profile
-- Run this in your Supabase SQL Editor

INSERT INTO public.user_profiles (id, email, username, balance, total_earned, games_played, created_at, updated_at)
VALUES (
    '97c65e10-bbcf-48db-8ca1-880cb7f5174b'::uuid,
    'arjunali.2025@gmail.com',
    'arjunali.2025',
    1000,
    0,
    0,
    NOW(),
    NOW()
);
