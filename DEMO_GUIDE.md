# 🎮 Happy Paisa - Demo Guide

Your Happy Paisa app is now running with **Supabase backend**!

## 🌐 Access the App
- **Frontend URL**: http://localhost:5173/
- **Status**: ✅ Running with Supabase backend integration

## 🧪 Testing Instructions

### 1. Demo Mode (No Registration Needed)
**Quick Start - Try Demo Mode:**
- Go to http://localhost:5173/
- In the Quick Sign In form, enter:
  - **Email**: `demo@example.com`
  - **Password**: `anything`
- Click "Try Sign In" → Demo mode will activate
- OR click "Try Demo" button directly

### 2. Real User Registration & Authentication
**Create a Real Account:**
- Go to http://localhost:5173/signin
- Toggle to "Sign Up" mode
- Enter real email/password
- Check your email for confirmation link
- Sign in with your credentials

### 3. Test Game Features (Both Modes)
1. **Play Games**: Go to Dashboard → Games
   - Try Happy Clicker, Memory Match, Math Quiz, etc.
   - In **Real Mode**: Scores saved to Supabase database
   - In **Demo Mode**: Scores simulated locally

2. **Check Rewards**: 
   - Each game awards Happy Paisa (HP) coins
   - Balance updates in real-time
   - View recent rewards in games dashboard

### 4. Test Wallet Features
1. **View Balance**: Dashboard → Wallet
   - See current HP balance and total earned
   - View transaction history
   
2. **Convert Coins**: 
   - Try converting HP to cash (demo conversion)
   - In **Real Mode**: Creates actual transaction records
   - In **Demo Mode**: Simulates conversion

### 5. Test Profile Management
1. **Update Profile**: Dashboard → Profile
   - Edit name, email, bio
   - Upload profile picture (local preview)
   - In **Real Mode**: Changes saved to Supabase
   - In **Demo Mode**: Changes stored locally

### 6. Test Authentication Features
1. **Sign Out**: Click user menu → Sign Out
2. **Sign In/Out Flow**: Navigate between authenticated and unauthenticated states
3. **Session Persistence**: Refresh page, should stay signed in

## 🔄 Switching Between Modes

### Demo Mode → Real Mode
1. Sign out from demo mode
2. Go to /signin and create real account
3. Sign in with real credentials

### Real Mode → Demo Mode  
1. Sign out from real account
2. Use `demo@example.com` or click "Try Demo"

## 🎯 Features to Test

### ✅ Working Features:
- [x] **Authentication**: Sign up, Sign in, Sign out
- [x] **Games**: Play and earn HP rewards  
- [x] **Wallet**: View balance, transactions, convert coins
- [x] **Profile**: View and edit profile information
- [x] **Real-time Updates**: Balance updates after games
- [x] **Demo Mode**: Full functionality without registration
- [x] **Responsive Design**: Works on mobile and desktop

### 🔍 What to Verify:

**In Real Mode:**
- Game scores persist after refresh
- Wallet balance updates correctly
- Profile changes save permanently
- Transaction history shows real data

**In Demo Mode:**  
- All features work without database
- Smooth fallback experience
- Can switch to real mode anytime

## 🐛 Troubleshooting

**If something doesn't work:**
1. Check browser console for errors (F12)
2. Verify Supabase connection: Run `node test-supabase.js`
3. Make sure you're on http://localhost:5173/

**Common Issues:**
- **"Invalid credentials"**: Use demo@example.com for demo mode
- **Features not working**: Check if you're in demo vs real mode
- **Profile not loading**: Refresh page or sign out/in

## 🎉 Success Indicators

You'll know it's working when:
- ✅ You can sign up with real email/password
- ✅ Games save scores and update wallet balance
- ✅ Profile changes persist after refresh  
- ✅ Transaction history shows your game rewards
- ✅ Demo mode works seamlessly without registration
- ✅ You can switch between real and demo modes

---

**Happy Gaming! 🎮💰**

Your app now has a fully functional cloud backend with Supabase!