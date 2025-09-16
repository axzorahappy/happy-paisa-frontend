import { useState, useEffect } from 'react'
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Gamepad2, 
  Gift, 
  User, 
  Wallet, 
  Menu, 
  X, 
  Bell,
  Home,
  ChevronDown,
  Bot,
  LogOut,
  LogIn
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const navigation = [
  { name: 'Games', href: '/dashboard', icon: Gamepad2 },
  { name: 'Rewards', href: '/dashboard/rewards', icon: Gift },
  { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
  { name: 'AI Assistant', href: '/dashboard/ai', icon: Bot },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
]

export default function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { 
    user, 
    profile, 
    loading, 
    isAuthenticated, 
    signOut 
  } = useAuth()
  
  // Redirect to signin if not authenticated and not loading
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/signin')
    }
  }, [loading, isAuthenticated, navigate])
  
  const handleSignOut = async () => {
    console.log('🚶 DashboardLayout: Sign out button clicked')
    try {
      console.log('📤 DashboardLayout: Calling signOut...')
      await signOut()
      console.log('✅ DashboardLayout: SignOut completed, navigating to home')
      navigate('/')
    } catch (error) {
      console.error('❌ DashboardLayout: Error signing out:', error)
      alert('Sign out failed: ' + (error as any).message)
    }
    setUserMenuOpen(false)
  }
  
  const handleSignIn = () => {
    navigate('/signin')
    setUserMenuOpen(false)
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Fixed for desktop, animated for mobile */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HP</span>
            </div>
            <span className="text-white font-semibold">Happy Paisa</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white border border-purple-500/30'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white/70 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Breadcrumb */}
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <span className="text-white/60">Dashboard</span>
              {location.pathname !== '/dashboard' && location.pathname !== '/dashboard/' && (
                <>
                  <span className="text-white/40">/</span>
                  <span className="text-white capitalize">
                    {location.pathname.split('/').pop()}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-white/70 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    profile.avatar_url.startsWith('emoji:') ? (
                      <div className="text-xl">
                        {profile.avatar_url.replace('emoji:', '')}
                      </div>
                    ) : (
                      <img 
                        src={profile.avatar_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">{profile?.username || user?.email?.split('@')[0] || 'Loading...'}</div>
                  <div className="text-xs text-white/60">
                    {loading ? 'Loading...' : isAuthenticated ? 'Authenticated' : 'Guest'}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* User menu dropdown */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl"
                  >
                    <div className="py-2">
                      <Link
                        to="/dashboard/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/dashboard/wallet"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Wallet className="w-4 h-4" />
                        <span>Wallet</span>
                      </Link>
                      <hr className="my-2 border-white/10" />
                      {isAuthenticated ? (
                        <button
                          onClick={handleSignOut}
                          className="flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      ) : (
                        <button
                          onClick={handleSignIn}
                          className="flex items-center space-x-3 px-4 py-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-colors w-full text-left"
                        >
                          <LogIn className="w-4 h-4" />
                          <span>Sign In</span>
                        </button>
                      )}
                      <Link
                        to="/"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Home className="w-4 h-4" />
                        <span>Back to Home</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  )
}