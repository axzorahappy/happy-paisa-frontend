import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Home from './Home';
import SigninPage from './SigninPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import ResetPasswordPage from './ResetPasswordPage';
import AuthCallback from './AuthCallback';
import TestPage from '../components/TestPage';
import SimpleTest from '../components/SimpleTest';
import MinimalTest from '../components/MinimalTest';
import Confirmation from './Confirmation';
import FloatingMrHappy from '../components/FloatingMrHappy';
import { AuthProvider } from '../contexts/AuthContext';
import { isFeatureEnabled } from '../lib/featureFlags';
import DashboardLayout from '../components/DashboardLayout';

// Lazy load dashboard pages
const DashboardHome = lazy(() => import('./DashboardHome'));
const GamesDashboard = lazy(() => import('./GamesDashboard'));
const RewardsDashboard = lazy(() => import('./RewardsDashboard'));
const WalletPage = lazy(() => import('./Wallet'));
const AIAssistant = lazy(() => import('./AIAssistant'));
const ProfilePage = lazy(() => import('./Profile'));

// Lazy load service modules
const Marketplace = lazy(() => import('./Marketplace'));
const AIHub = lazy(() => import('./AIHub'));

// Placeholder components for missing services
const P2PTrading = lazy(() => Promise.resolve({ default: () => <div className="p-6"><h1 className="text-2xl font-bold text-white">P2P Trading</h1><p className="text-hp-glass-300">Coming Soon</p></div> }));
const Travel = lazy(() => Promise.resolve({ default: () => <div className="p-6"><h1 className="text-2xl font-bold text-white">Travel</h1><p className="text-hp-glass-300">Coming Soon</p></div> }));
const Payments = lazy(() => Promise.resolve({ default: () => <div className="p-6"><h1 className="text-2xl font-bold text-white">Payments</h1><p className="text-hp-glass-300">Coming Soon</p></div> }));
const SmartHome = lazy(() => Promise.resolve({ default: () => <div className="p-6"><h1 className="text-2xl font-bold text-white">Smart Home</h1><p className="text-hp-glass-300">Coming Soon</p></div> }));
const MyHealth = lazy(() => Promise.resolve({ default: () => <div className="p-6"><h1 className="text-2xl font-bold text-white">My Health</h1><p className="text-hp-glass-300">Coming Soon</p></div> }));
const Entertainment = lazy(() => Promise.resolve({ default: () => <div className="p-6"><h1 className="text-2xl font-bold text-white">Entertainment</h1><p className="text-hp-glass-300">Coming Soon</p></div> }));
const HappyCricket = lazy(() => Promise.resolve({ default: () => <div className="p-6"><h1 className="text-2xl font-bold text-white">Happy Cricket</h1><p className="text-hp-glass-300">Coming Soon</p></div> }));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-96 flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-hp-purple-500/30 border-t-hp-purple-500 rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-svh text-[var(--text)]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Dashboard with new layout */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={
                <Suspense fallback={<LoadingSpinner />}>
                  <DashboardHome />
                </Suspense>
              } />
              
              {/* Legacy routes */}
              <Route path="games" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <GamesDashboard />
                </Suspense>
              } />
              <Route path="rewards" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <RewardsDashboard />
                </Suspense>
              } />
              <Route path="wallet" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <WalletPage />
                </Suspense>
              } />
              <Route path="ai" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AIAssistant />
                </Suspense>
              } />
              <Route path="profile" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ProfilePage />
                </Suspense>
              } />
              
              {/* New service modules */}
              <Route path="marketplace" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Marketplace />
                </Suspense>
              } />
              <Route path="p2p-trading" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <P2PTrading />
                </Suspense>
              } />
              <Route path="travel" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Travel />
                </Suspense>
              } />
              <Route path="payments" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Payments />
                </Suspense>
              } />
              <Route path="smart-home" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <SmartHome />
                </Suspense>
              } />
              <Route path="my-health" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <MyHealth />
                </Suspense>
              } />
              <Route path="entertainment" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Entertainment />
                </Suspense>
              } />
              <Route path="ai-hub" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AIHub />
                </Suspense>
              } />
              <Route path="happy-cricket" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <HappyCricket />
                </Suspense>
              } />
            </Route>
            
            {/* Test routes */}
            <Route path="/test" element={<TestPage />} />
            <Route path="/simple-test" element={<SimpleTest />} />
            <Route path="/minimal" element={<MinimalTest />} />
            <Route path="/confirmation" element={<Confirmation />} />
            
            {/* Legacy redirects */}
            <Route path="/app" element={<Navigate to="/dashboard" replace />} />
            <Route path="/app/wallet" element={<Navigate to="/dashboard/wallet" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
