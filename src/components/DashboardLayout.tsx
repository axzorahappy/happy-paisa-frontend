import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Bot, 
  Phone, 
  Receipt, 
  Plane, 
  Utensils 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navigation = [
  { name: 'Recharge', href: '/dashboard/recharge', icon: Phone },
  { name: 'Bill Payments', href: '/dashboard/payments', icon: Receipt },
  { name: 'Travel', href: '/dashboard/travel', icon: Plane },
];

const lifestyleNav = [
  { name: 'Food Delivery', href: '/dashboard/food', icon: Utensils },
];

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
    <div className="min-h-screen flex bg-[#1a1a1a] text-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#2c2c2c] p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg">Happy Paisa</span>
              <span className="text-xs text-gray-400">Smart Assistant</span>
            </div>
          </div>
          <nav>
            <h3 className="text-xs text-gray-500 uppercase font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href} 
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${location.pathname === item.href ? 'bg-blue-500' : 'hover:bg-gray-700'}`}>
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-xs text-gray-500 uppercase font-bold my-4">Lifestyle</h3>
            <ul className="space-y-2">
              {lifestyleNav.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href} 
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${location.pathname === item.href ? 'bg-blue-500' : 'hover:bg-gray-700'}`}>
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Bot size={24} />
            </div>
            <div>
              <h4 className="font-bold">Mr. Happy</h4>
              <p className="text-xs text-gray-400">Listening...</p>
            </div>
            <button className="ml-auto p-2 bg-blue-500 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93V15h3a1 1 0 110 2H6a1 1 0 110-2h3v-2.07A5.002 5.002 0 015 9V7a5 5 0 0110 0v2a5.002 5.002 0 01-2 4.93z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <ul className="space-y-2">
            <li><button className="w-full text-left p-3 bg-gray-700 rounded-lg">Check Balance</button></li>
            <li><button className="w-full text-left p-3 bg-gray-700 rounded-lg">Mobile Recharge</button></li>
            <li><button className="w-full text-left p-3 bg-gray-700 rounded-lg">Pay Bills</button></li>
            <li><button className="w-full text-left p-3 bg-blue-500 rounded-lg">Chat with Mr. Happy</button></li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#2c2c2c] p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Travel Booking</h1>
            <p className="text-gray-400">Manage your travel services</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Search or ask Mr. Happy..." className="bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 w-72" />
            </div>
            <Bell size={24} />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              <div>
                <p className="font-bold">John Doe</p>
                <p className="text-sm text-gray-400">₹12,450.75</p>
              </div>
              <ChevronDown size={20} />
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}