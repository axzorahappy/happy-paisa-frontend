# 🎯 Happy Paisa - Gaming Platform Frontend

> **Earn rewards by playing games** - A comprehensive React web application for the Happy Paisa gaming platform.

## 🌐 Live Demo

**Production**: [https://happypaisa.com](https://happypaisa.com)

## ✨ Features

### 🎮 Gaming Dashboard
- **Multiple Game Types**: Clicker, Memory, Math, Snake, Word games
- **Real-time Scoring**: Live score tracking and leaderboards
- **Reward System**: Earn Happy Paisa (HP) coins for gameplay

### 💰 Wallet & Currency System
- **Multi-currency Support**: INR, USD, EUR
- **Happy Coins (HC)**: Premium currency (1 HC = 1000 INR)
- **Buying System**: Purchase Happy Coins via Stripe integration
- **Staking Features**: Stake coins for additional rewards
- **Transaction History**: Complete transaction tracking

### 🏆 Rewards & Analytics
- **Achievement System**: Unlock achievements for various activities
- **Leaderboards**: Compete with other players
- **Analytics Dashboard**: Track your gaming progress
- **Daily Rewards**: Login and activity bonuses

### 🔐 Authentication & Profiles
- **Supabase Auth**: Email/password authentication with verification
- **User Profiles**: Customizable player profiles
- **Session Management**: Secure login persistence
- **Password Recovery**: Email-based password reset

### 🎨 UI/UX Features
- **Responsive Design**: Mobile-first responsive interface
- **Dark/Light Themes**: Customizable appearance
- **Interactive Animations**: Smooth transitions and effects
- **Progressive Web App**: Installable on mobile devices
- **Floating Assistant**: Mr. Happy character guide

## 🛠️ Technology Stack

### Frontend Core
- **React 18** - Modern React with hooks and context
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

### State Management & Data
- **React Context** - Authentication and global state
- **Supabase** - Backend as a Service
  - Authentication
  - Real-time database
  - Row Level Security (RLS)
- **HTTP API Integration** - RESTful API communication

### Routing & Navigation
- **React Router v6** - Client-side routing
- **Protected Routes** - Authentication-based access control
- **Dynamic Loading** - Code splitting for performance

### Payment & External Services
- **Stripe** - Payment processing for Happy Coins
- **Email Verification** - Secure account activation
- **Real-time Updates** - Live data synchronization

### Build & Deployment
- **Netlify** - Hosting and CI/CD
- **Custom Domain** - happypaisa.com with SSL
- **SPA Routing** - Single Page Application configuration

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AuthPanel.tsx   # Login/Register forms
│   ├── DashboardLayout.tsx # Main app layout
│   ├── FloatingMrHappy.tsx # Character assistant
│   ├── Wallet.tsx      # Wallet interface
│   └── games/          # Game components
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── pages/              # Main application pages
│   ├── GamesDashboard.tsx
│   ├── RewardsDashboard.tsx
│   ├── Wallet.tsx
│   ├── Profile.tsx
│   └── AuthCallback.tsx
├── services/           # External service integrations
│   ├── supabaseAPI.ts  # Supabase client operations
│   ├── httpSupabaseAPI.ts # HTTP-based API calls
│   └── api.ts          # General API utilities
├── lib/                # Utility libraries
│   └── supabase.ts     # Supabase client configuration
└── styles/             # Global styles and themes
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **Supabase Account** (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/axzorahappy/happy-paisa-frontend.git
   cd happy-paisa-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` file:
   ```bash
   # Production Environment
   VITE_APP_URL=https://happypaisa.com
   VITE_BACKEND_URL=https://happypaisa.com/api
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Development Server**
   ```bash
   npm run dev
   ```

   App will be available at `http://localhost:5173`

### Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Build with validation
node build-production.cjs
```

## 🗄️ Database Schema

The application uses Supabase with the following key tables:

### User Management
- `user_profiles` - User account information
- `auth.users` - Supabase authentication

### Gaming & Rewards
- `game_scores` - Individual game results
- `wallet_transactions` - Transaction history
- `wallet_ledger` - Balance tracking
- `staking_positions` - Coin staking records

### Payment System
- `coin_packages` - Available coin packages
- `payment_transactions` - Purchase records

## 🔧 Configuration

### Authentication Setup
1. Configure Supabase Auth settings
2. Add redirect URLs for email verification:
   - `https://happypaisa.com/auth/callback`
   - `https://happypaisa.com`

### Payment Integration
1. Set up Stripe account
2. Configure webhook endpoints
3. Add Stripe public keys to environment

### Database Security
- Row Level Security (RLS) enabled
- User-scoped data access
- Secure API endpoints

## 📱 Mobile Support

- **Responsive Design**: Optimized for all screen sizes
- **PWA Features**: Installable as native app
- **Touch Interactions**: Mobile-friendly controls
- **Performance**: Optimized for mobile networks

## 🚀 Deployment

### Netlify Deployment (Current)
```bash
# Deploy to production
netlify deploy --prod --dir=dist

# The app is live at: https://happypaisa.com
```

### Alternative Deployment Options
- **Vercel**: `vercel --prod`
- **Google Cloud Run**: Container deployment
- **AWS Amplify**: Full-stack deployment

## 🧪 Testing

```bash
# Run tests
npm test

# Test coverage
npm run test:coverage

# E2E testing
npm run test:e2e
```

## 📊 Performance

- **Lighthouse Score**: 90+ across all categories
- **Bundle Size**: Optimized with code splitting
- **Loading Time**: <3s initial load
- **SEO Optimized**: Meta tags and structured data

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **HTTPS Only**: SSL/TLS encryption
- **Input Validation**: XSS and injection protection
- **Secure Headers**: Security-focused HTTP headers
- **Environment Isolation**: Sensitive data in env vars

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

## 📄 License

This project is private and proprietary. All rights reserved.

## 📞 Support

- **Email**: support@happypaisa.com
- **Documentation**: [Internal Wiki]
- **Issues**: GitHub Issues (for team members)

---

## 🎯 Development Roadmap

### Completed ✅
- Multi-currency wallet system
- Game integration and scoring
- User authentication and profiles
- Payment processing with Stripe
- Responsive mobile design
- Production deployment

### In Progress 🚧
- Advanced analytics dashboard
- Social features and friend system
- Tournament and competition modes
- Mobile app (React Native)

### Planned 📋
- AI-powered game recommendations
- Blockchain integration
- Advanced staking mechanisms
- Multi-language support

---

**Happy Paisa** - Where gaming meets earning! 🎮💰