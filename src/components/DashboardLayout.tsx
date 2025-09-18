import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard,
  ShoppingBag,
  ArrowLeftRight,
  Plane,
  CreditCard,
  House,
  Activity,
  Clapperboard,
  Brain,
  Trophy,
  Wallet,
  Gift,
  User,
  Menu,
  X,
  LogOut,
  Bell,
  Settings,
  Home,
  ChevronDown,
  Search,
  Command
} from 'lucide-react'
import { getSupabase } from '../lib/supabase'
import FloatingMrHappy from './FloatingMrHappy'

// Enhanced navigation with comprehensive service ecosystem
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, category: 'main' },
  { name: 'Marketplace', href: '/dashboard/marketplace', icon: ShoppingBag, category: 'services' },
  { name: 'P2P Trading', href: '/dashboard/p2p-trading', icon: ArrowLeftRight, category: 'services' },
  { name: 'Travel', href: '/dashboard/travel', icon: Plane, category: 'services' },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCard, category: 'services' },
  { name: 'Smart Home', href: '/dashboard/smart-home', icon: House, category: 'services' },
  { name: 'My Health', href: '/dashboard/my-health', icon: Activity, category: 'services' },
  { name: 'Entertainment', href: '/dashboard/entertainment', icon: Clapperboard, category: 'services' },
  { name: 'AI Hub', href: '/dashboard/ai-hub', icon: Brain, category: 'ai' },
  { name: 'Happy Cricket', href: '/dashboard/happy-cricket', icon: Trophy, category: 'games' },
  { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet, category: 'finance' },
  { name: 'Rewards', href: '/dashboard/rewards', icon: Gift, category: 'finance' },
  { name: 'Profile', href: '/dashboard/profile', icon: User, category: 'account' },
]

export default function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const supabase = getSupabase()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    if (!supabase) return

    const getUser = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user ?? null)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        navigate('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, navigate])

  const handleSignOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    navigate('/')
  }

  // Get display name with fallback
  const getDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
    }
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return 'Harish Kumar' // Default fallback
  }

  // Search keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setUserMenuOpen(false)
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/'
    }
    return location.pathname.startsWith(href)
  }

  // Temporary bypass for testing - comment out authentication check
  // if (!user) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
  //         <p className="text-white/70">Loading...</p>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-hp-gradient bg-hp-radial">
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

      {/* Sidebar - Enhanced glass design */}
      <motion.div 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-card-gradient backdrop-blur-xl border-r border-hp-glass-border shadow-glass-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : '-100%'
        }}
      >
        {/* Enhanced Logo Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-hp-glass-border">
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-hp-gradient-alt rounded-xl-2 flex items-center justify-center shadow-purple-glow group-hover:shadow-ai-glow transition-all duration-300">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <div>
              <span className="text-white font-bold text-lg block">Happy Paisa</span>
              <span className="text-hp-glass-300 text-xs">Smart Digital Assistant</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white p-2 rounded-lg hover:bg-hp-glass-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Enhanced Navigation with Groups */}
        <nav className="px-4 py-6 space-y-6 overflow-y-auto flex-1">
          {/* Main Dashboard */}
          <div>
            {navigation.filter(item => item.category === 'main').map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl-2 transition-all duration-200 group ${
                    active
                      ? 'bg-hp-gradient-alt text-white shadow-purple-glow border border-hp-purple-500/30'
                      : 'text-white/80 hover:text-white hover:bg-hp-glass-100 hover:shadow-glass'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${active ? 'text-white' : 'group-hover:text-hp-purple-300'}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Services Section */}
          <div>
            <h3 className="text-hp-glass-300 text-xs font-semibold uppercase tracking-wider mb-3 px-4">
              Services
            </h3>
            <div className="space-y-1">
              {navigation.filter(item => item.category === 'services').map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                      active
                        ? 'bg-hp-glass-200 text-white border-l-2 border-hp-purple-400'
                        : 'text-white/70 hover:text-white hover:bg-hp-glass-50 hover:border-l-2 hover:border-hp-purple-400/50'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${active ? 'text-hp-purple-300' : 'group-hover:text-hp-purple-300'}`} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* AI & Games */}
          <div>
            <h3 className="text-hp-glass-300 text-xs font-semibold uppercase tracking-wider mb-3 px-4">
              AI & Games
            </h3>
            <div className="space-y-1">
              {navigation.filter(item => item.category === 'ai' || item.category === 'games').map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                      active
                        ? 'bg-ai-gradient text-white border-l-2 border-hp-fuchsia-400'
                        : 'text-white/70 hover:text-white hover:bg-hp-glass-50 hover:border-l-2 hover:border-hp-fuchsia-400/50'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${active ? 'text-hp-fuchsia-300' : 'group-hover:text-hp-fuchsia-300'}`} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Finance */}
          <div>
            <h3 className="text-hp-glass-300 text-xs font-semibold uppercase tracking-wider mb-3 px-4">
              Finance
            </h3>
            <div className="space-y-1">
              {navigation.filter(item => item.category === 'finance').map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                      active
                        ? 'bg-success-gradient text-white border-l-2 border-hp-success'
                        : 'text-white/70 hover:text-white hover:bg-hp-glass-50 hover:border-l-2 hover:border-hp-success/50'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${active ? 'text-green-300' : 'group-hover:text-green-300'}`} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>

        {/* Account Section */}
        <div className="border-t border-hp-glass-border p-4">
          <h3 className="text-hp-glass-300 text-xs font-semibold uppercase tracking-wider mb-3 px-4">
            Account
          </h3>
          <div className="space-y-1">
            {navigation.filter(item => item.category === 'account').map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                    active
                      ? 'bg-hp-glass-200 text-white border-l-2 border-hp-info'
                      : 'text-white/70 hover:text-white hover:bg-hp-glass-50 hover:border-l-2 hover:border-hp-info/50'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${active ? 'text-blue-300' : 'group-hover:text-blue-300'}`} />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              )
            })}
          </div>
          
          {/* Back to Home */}
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-2.5 mt-4 rounded-lg text-white/70 hover:text-white hover:bg-hp-glass-50 transition-colors group"
          >
            <Home className="w-4 h-4 group-hover:text-hp-purple-300" />
            <span className="font-medium text-sm">Back to Home</span>
          </Link>
        </div>
      </motion.div>


      {/* Main content */}
      <div className="lg:pl-72">
        {/* Enhanced Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-card-gradient backdrop-blur-xl border-b border-hp-glass-border shadow-glass">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white/70 hover:text-white p-2 rounded-lg hover:bg-hp-glass-100 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Enhanced Breadcrumb */}
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-hp-glass-300 text-sm font-medium">Dashboard</span>
              {location.pathname !== '/dashboard' && location.pathname !== '/dashboard/' && (
                <>
                  <span className="text-hp-glass-200">/</span>
                  <span className="text-white text-sm font-medium capitalize">
                    {location.pathname.split('/').pop()?.replace('-', ' ')}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Center - Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center space-x-3 px-4 py-2.5 bg-hp-glass-50 hover:bg-hp-glass-100 border border-hp-glass-border rounded-lg transition-colors group"
              >
                <Search className="w-4 h-4 text-hp-glass-300 group-hover:text-white" />
                <span className="text-hp-glass-300 group-hover:text-white text-sm flex-1 text-left">
                  Search Axzora...
                </span>
                <div className="flex items-center space-x-1 text-xs text-hp-glass-300">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </div>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button className="relative p-2.5 text-white/70 hover:text-white hover:bg-hp-glass-100 rounded-lg transition-colors group">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-hp-error rounded-full animate-pulse"></span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-hp-glass-50 hover:bg-hp-glass-100 text-white hover:shadow-glass transition-all duration-200 group"
              >
                <div className="w-9 h-9 bg-hp-gradient-alt rounded-xl flex items-center justify-center shadow-purple-glow group-hover:shadow-ai-glow transition-all">
                  <span className="text-white font-semibold text-sm">
                    {getDisplayName().charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-semibold text-white">{getDisplayName()}</div>
                  <div className="text-xs text-hp-glass-300">Authenticated</div>
                </div>
                <ChevronDown className="w-4 h-4 text-hp-glass-300 group-hover:text-white transition-colors" />
              </button>

              {/* Enhanced User dropdown */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-56 bg-card-gradient backdrop-blur-xl rounded-xl border border-hp-glass-border shadow-glass-lg overflow-hidden"
                  >
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-hp-glass-border">
                      <div className="text-sm font-semibold text-white">{getDisplayName()}</div>
                      <div className="text-xs text-hp-glass-300">{user?.email || 'demo@happypaisa.com'}</div>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        to="/dashboard/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2.5 text-white/80 hover:text-white hover:bg-hp-glass-100 transition-colors group"
                      >
                        <User className="w-4 h-4 group-hover:text-hp-purple-300" />
                        <span>View Profile</span>
                      </Link>
                      <Link
                        to="/dashboard/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2.5 text-white/80 hover:text-white hover:bg-hp-glass-100 transition-colors group"
                      >
                        <Settings className="w-4 h-4 group-hover:text-hp-purple-300" />
                        <span>Settings</span>
                      </Link>
                      
                      <div className="my-2 border-t border-hp-glass-border"></div>
                      
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-error-gradient transition-colors w-full text-left group"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Page content with enhanced background */}
        <main className="min-h-screen bg-hp-radial-accent">
          <div className="error-boundary">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Search Modal Placeholder */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.95 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-50 mx-4"
            >
              <div className="bg-card-gradient backdrop-blur-xl border border-hp-glass-border rounded-xl-2 shadow-glass-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Search className="w-5 h-5 text-hp-purple-400" />
                    <input
                      type="text"
                      placeholder="Search across all services..."
                      className="flex-1 bg-transparent text-white placeholder-hp-glass-300 focus:outline-none text-lg"
                      autoFocus
                    />
                    <button
                      onClick={() => setSearchOpen(false)}
                      className="p-1 hover:bg-hp-glass-100 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-hp-glass-300" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-hp-glass-300 text-sm font-medium mb-2">Quick Actions</div>
                    {[
                      { name: 'Shop Now', href: '/dashboard/marketplace', icon: ShoppingBag },
                      { name: 'Book Ride', href: '/dashboard/travel', icon: Plane },
                      { name: 'Quick Pay', href: '/dashboard/payments', icon: CreditCard },
                      { name: 'Ask Mr Happy', href: '/dashboard/ai-hub', icon: Brain },
                    ].map((action) => (
                      <Link
                        key={action.name}
                        to={action.href}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-hp-glass-100 transition-colors group"
                      >
                        <action.icon className="w-4 h-4 text-hp-glass-300 group-hover:text-hp-purple-300" />
                        <span className="text-white group-hover:text-hp-purple-300">{action.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Click outside to close menus */}
      {(userMenuOpen || searchOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setUserMenuOpen(false)
            setSearchOpen(false)
          }}
        />
      )}

      {/* Floating Mr. Happy Chat Widget */}
      <FloatingMrHappy />
    </div>
  )
}
