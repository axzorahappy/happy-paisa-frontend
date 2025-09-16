import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './Home'
import DashboardLayout from '../components/DashboardLayout'
import GamesDashboard from './GamesDashboard'
import RewardsDashboard from './RewardsDashboard'
import WalletPage from './Wallet'
import AIAssistant from './AIAssistant'
import ProfilePage from './Profile'
import SigninPage from './SigninPage'
import ForgotPasswordPage from './ForgotPasswordPage'
import ResetPasswordPage from './ResetPasswordPage'
import AuthCallback from './AuthCallback'
// import LeaderboardDemo from '../components/LeaderboardDemo'
import TestPage from '../components/TestPage'
import SimpleTest from '../components/SimpleTest'
import MinimalTest from '../components/MinimalTest'
import BasicTest from '../components/BasicTest'
import FloatingMrHappy from '../components/FloatingMrHappy'
import { AuthProvider } from '../contexts/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-svh text-[var(--text)]">
          <FloatingMrHappy />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<GamesDashboard />} />
              <Route path="rewards" element={<RewardsDashboard />} />
              <Route path="wallet" element={<WalletPage />} />
              <Route path="ai" element={<AIAssistant />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            {/* <Route path="/leaderboard-demo" element={<LeaderboardDemo />} /> */}
            <Route path="/test" element={<TestPage />} />
            <Route path="/simple-test" element={<SimpleTest />} />
            <Route path="/minimal" element={<MinimalTest />} />
            <Route path="/basic" element={<BasicTest />} />
            {/* Legacy route redirects */}
            <Route path="/app" element={<Navigate to="/dashboard" replace />} />
            <Route path="/app/wallet" element={<Navigate to="/dashboard/wallet" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
