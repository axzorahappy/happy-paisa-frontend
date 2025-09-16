# 🔧 Fix Authentication Issues - Supabase Database Setup

## 🚨 **PROBLEM IDENTIFIED**

The authentication issues you're experiencing are because:

1. **Database tables don't exist** - The `user_profiles` table hasn't been created in Supabase
2. **Sign-out works** but falls back to demo mode due to missing tables
3. **Real authentication fails** because there's no database to store user data

## ✅ **SOLUTION: Setup Supabase Database**

### **Step 1: Go to Supabase Dashboard**
1. Open your browser and go to: **https://app.supabase.com**
2. Sign in to your account
3. Click on your **Happy Paisa project**

### **Step 2: Open SQL Editor**
1. In the left sidebar, click **"SQL Editor"**
2. Click **"New query"** or the **"+"** button

### **Step 3: Run Database Schema**
Copy and paste this SQL code into the editor:

```sql
-- Happy Paisa Database Schema for Supabase
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    balance INTEGER DEFAULT 1000 NOT NULL,
    total_earned INTEGER DEFAULT 0 NOT NULL,
    games_played INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Game Scores Table
CREATE TABLE IF NOT EXISTS public.game_scores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    game_type TEXT NOT NULL CHECK (game_type IN ('clicker', 'memory', 'math', 'snake', 'word')),
    score INTEGER NOT NULL DEFAULT 0,
    reward INTEGER NOT NULL DEFAULT 0,
    time_spent INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Wallet Transactions Table
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('earned', 'spent', 'bonus', 'refund')),
    amount INTEGER NOT NULL,
    description TEXT NOT NULL,
    game_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS user_profiles_username_idx ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS user_profiles_total_earned_idx ON public.user_profiles(total_earned DESC);
CREATE INDEX IF NOT EXISTS game_scores_user_id_idx ON public.game_scores(user_id);
CREATE INDEX IF NOT EXISTS game_scores_created_at_idx ON public.game_scores(created_at DESC);
CREATE INDEX IF NOT EXISTS wallet_transactions_user_id_idx ON public.wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS wallet_transactions_created_at_idx ON public.wallet_transactions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Allow reading other users' profiles for leaderboard (limited columns)
CREATE POLICY "Users can view leaderboard data" ON public.user_profiles
    FOR SELECT USING (true);

-- RLS Policies for game_scores
CREATE POLICY "Users can view own game scores" ON public.game_scores
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game scores" ON public.game_scores
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for wallet_transactions
CREATE POLICY "Users can view own transactions" ON public.wallet_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON public.wallet_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, username)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
```

### **Step 4: Execute the SQL**
1. Click the **"Run"** button (play icon) or press **Ctrl+Enter**
2. Wait for the query to complete
3. You should see: **"Success. No rows returned"**

### **Step 5: Verify Tables Created**
1. Go to **"Table Editor"** in the left sidebar
2. You should now see these tables:
   - ✅ `user_profiles`
   - ✅ `game_scores` 
   - ✅ `wallet_transactions`

### **Step 6: Test Authentication**
1. Go back to your app: **http://localhost:5173**
2. Try signing up with a real email/password
3. Check your email for confirmation link
4. After confirmation, sign in again
5. You should now see **"Real Mode"** instead of **"Demo Mode"**!

## 🧪 **Test the Fix**

Run this debug command to verify:

```powershell
node debug-auth.js
```

You should now see:
- ✅ Tables exist
- ✅ Real authentication working
- ✅ User profiles being created
- ✅ Sign out working properly

## 🎯 **Expected Results After Setup**

### **Before Database Setup:**
- ❌ Always shows "Demo Mode"
- ❌ Can't sign out properly
- ❌ Real authentication fails
- ❌ Data doesn't persist

### **After Database Setup:**
- ✅ Real authentication works
- ✅ Shows "Real Mode" when signed in
- ✅ Sign out works correctly
- ✅ User data persists in Supabase
- ✅ Games save scores to database
- ✅ Wallet shows real transactions

## 🎮 **Ready to Use!**

Once the database is set up:

1. **Sign up** with your real email (e.g., arjunali@example.com)
2. **Confirm email** via the link sent to you
3. **Sign in** with your credentials
4. **Enjoy real mode** with persistent data!

The app will show:
- **"Real Mode"** in the user menu
- **Your actual username** instead of "Demo User"
- **Persistent game scores** and wallet balance
- **Working sign out** functionality

---

**🔧 This fix will resolve both your authentication issues!** 🔧