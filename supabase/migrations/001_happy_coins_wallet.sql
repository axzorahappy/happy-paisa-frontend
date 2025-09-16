-- Happy Paisa Wallet System - Database Schema
-- This migration adds support for Happy Coins, staking, and payments

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS wallet_ledger CASCADE;
DROP TABLE IF EXISTS staking_positions CASCADE;
DROP TABLE IF EXISTS coin_packages CASCADE;
DROP TABLE IF EXISTS payment_transactions CASCADE;

-- Create enum types
DO $$ BEGIN
    CREATE TYPE currency_type AS ENUM ('USD', 'EUR', 'INR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ledger_type AS ENUM ('purchase', 'stake', 'unstake', 'reward', 'conversion', 'bonus');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE staking_status AS ENUM ('active', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Coin Packages Table
CREATE TABLE coin_packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    happy_coins INTEGER NOT NULL CHECK (happy_coins > 0),
    price_usd DECIMAL(10,2) NOT NULL CHECK (price_usd > 0),
    price_eur DECIMAL(10,2) NOT NULL CHECK (price_eur > 0),
    price_inr DECIMAL(10,2) NOT NULL CHECK (price_inr > 0),
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Payment Transactions Table
CREATE TABLE payment_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    package_id UUID REFERENCES coin_packages(id),
    stripe_session_id VARCHAR(255),
    stripe_payment_intent_id VARCHAR(255),
    currency currency_type NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    happy_coins INTEGER NOT NULL,
    status payment_status DEFAULT 'pending',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT fk_payment_user FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
);

-- 3. Wallet Ledger Table (tracks all Happy Coin movements)
CREATE TABLE wallet_ledger (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    type ledger_type NOT NULL,
    happy_coins DECIMAL(10,3) NOT NULL, -- Can be negative for spending
    happy_paisa INTEGER DEFAULT 0, -- For conversions
    description TEXT NOT NULL,
    reference_id UUID, -- References payment, staking, etc.
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_ledger_user FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
);

-- 4. Staking Positions Table
CREATE TABLE staking_positions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    happy_coins DECIMAL(10,3) NOT NULL CHECK (happy_coins > 0),
    apy_rate DECIMAL(5,2) NOT NULL CHECK (apy_rate >= 0),
    duration_days INTEGER NOT NULL CHECK (duration_days > 0),
    status staking_status DEFAULT 'active',
    staked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    matures_at TIMESTAMP WITH TIME ZONE NOT NULL,
    claimed_at TIMESTAMP WITH TIME ZONE,
    reward_amount DECIMAL(10,3) DEFAULT 0,
    early_withdrawal BOOLEAN DEFAULT FALSE,
    penalty_amount DECIMAL(10,3) DEFAULT 0,
    
    CONSTRAINT fk_staking_user FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
);

-- 5. Update user_profiles table to add Happy Coins balance
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS happy_coins DECIMAL(10,3) DEFAULT 0 CHECK (happy_coins >= 0);

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS staked_amount DECIMAL(10,3) DEFAULT 0 CHECK (staked_amount >= 0);

-- Insert default coin packages
INSERT INTO coin_packages (name, description, happy_coins, price_usd, price_eur, price_inr, is_popular) VALUES
('Basic Package', 'Perfect for getting started', 10, 9.99, 8.49, 999.99, FALSE),
('Popular Package', 'Most popular choice', 25, 19.99, 16.99, 1999.99, TRUE),
('Premium Package', 'Best value for serious players', 50, 34.99, 29.74, 3499.99, FALSE);

-- Create indexes for better performance
CREATE INDEX idx_wallet_ledger_user_id ON wallet_ledger(user_id);
CREATE INDEX idx_wallet_ledger_created_at ON wallet_ledger(created_at DESC);
CREATE INDEX idx_staking_user_id ON staking_positions(user_id);
CREATE INDEX idx_staking_status ON staking_positions(status);
CREATE INDEX idx_staking_matures_at ON staking_positions(matures_at);
CREATE INDEX idx_payment_user_id ON payment_transactions(user_id);
CREATE INDEX idx_payment_status ON payment_transactions(status);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_coin_packages_updated_at BEFORE UPDATE ON coin_packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE wallet_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE staking_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Policies for wallet_ledger
CREATE POLICY "Users can view their own ledger entries" ON wallet_ledger
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own ledger entries" ON wallet_ledger
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Policies for staking_positions  
CREATE POLICY "Users can view their own staking positions" ON staking_positions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own staking positions" ON staking_positions
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own staking positions" ON staking_positions
    FOR UPDATE USING (user_id = auth.uid());

-- Policies for payment_transactions
CREATE POLICY "Users can view their own payment transactions" ON payment_transactions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own payment transactions" ON payment_transactions
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Coin packages are public (read-only)
ALTER TABLE coin_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active coin packages" ON coin_packages
    FOR SELECT USING (is_active = TRUE);