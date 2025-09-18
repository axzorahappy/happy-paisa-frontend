import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Plane,
  CreditCard,
  House,
  Brain,
  Trophy,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  Bell,
  Wallet,
  Activity,
  Clapperboard,
  ArrowLeftRight,
  Gift,
  Zap
} from 'lucide-react';
import { getSupabase } from '../lib/supabase';

interface QuickAction {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  gradient: string;
  description: string;
}

interface ServiceModule {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  description: string;
  category: string;
  featured?: boolean;
}

const quickActions: QuickAction[] = [
  {
    name: 'Shop Now',
    href: '/dashboard/marketplace',
    icon: ShoppingBag,
    gradient: 'from-hp-purple-500 to-hp-fuchsia-500',
    description: 'Browse products and services'
  },
  {
    name: 'Book Ride',
    href: '/dashboard/travel',
    icon: Plane,
    gradient: 'from-hp-fuchsia-500 to-hp-pink-500',
    description: 'Travel bookings and rides'
  },
  {
    name: 'Smart Home',
    href: '/dashboard/smart-home',
    icon: House,
    gradient: 'from-hp-purple-600 to-hp-purple-400',
    description: 'Control your smart devices'
  },
  {
    name: 'Quick Pay',
    href: '/dashboard/payments',
    icon: CreditCard,
    gradient: 'from-hp-success to-emerald-400',
    description: 'Fast payments and transfers'
  },
  {
    name: 'Ask Mr Happy',
    href: '/dashboard/ai-hub',
    icon: Brain,
    gradient: 'from-hp-accent to-hp-purple-400',
    description: 'AI-powered assistance'
  }
];

const serviceModules: ServiceModule[] = [
  {
    name: 'Marketplace',
    href: '/dashboard/marketplace',
    icon: ShoppingBag,
    description: 'Shop products, services and deals',
    category: 'commerce',
    featured: true
  },
  {
    name: 'P2P Trading',
    href: '/dashboard/p2p-trading',
    icon: ArrowLeftRight,
    description: 'Peer-to-peer trading platform',
    category: 'finance'
  },
  {
    name: 'Travel',
    href: '/dashboard/travel',
    icon: Plane,
    description: 'Book flights, hotels, and rides',
    category: 'lifestyle',
    featured: true
  },
  {
    name: 'Payments',
    href: '/dashboard/payments',
    icon: CreditCard,
    description: 'Manage payments and transfers',
    category: 'finance'
  },
  {
    name: 'Smart Home',
    href: '/dashboard/smart-home',
    icon: House,
    description: 'IoT device management',
    category: 'technology'
  },
  {
    name: 'My Health',
    href: '/dashboard/my-health',
    icon: Activity,
    description: 'Health tracking and wellness',
    category: 'lifestyle'
  },
  {
    name: 'Entertainment',
    href: '/dashboard/entertainment',
    icon: Clapperboard,
    description: 'Movies, music, and content',
    category: 'lifestyle',
    featured: true
  },
  {
    name: 'Happy Cricket',
    href: '/dashboard/happy-cricket',
    icon: Trophy,
    description: 'Cricket games and tournaments',
    category: 'games'
  }
];

export default function DashboardHome() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Get display name with fallback
  const getDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Harish Kumar'; // Default fallback
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-hp-purple-500/30 border-t-hp-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative px-6 py-12 overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-hp-radial opacity-30"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-hp-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-hp-fuchsia-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4"
            >
              {getGreeting()}, {getDisplayName().split(' ')[0]} 👋
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl md:text-2xl text-hp-glass-200 mb-8 max-w-3xl mx-auto"
            >
              Here's your unified digital ecosystem at a glance.
            </motion.p>
          </div>

          {/* MR Happy AI Assistant CTA */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-md mx-auto mb-16"
          >
            <Link
              to="/dashboard/ai-hub"
              className="group relative block p-6 bg-ai-gradient border border-hp-glass-border rounded-2xl-plus shadow-ai-glow hover:shadow-glass-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-hp-gradient-alt rounded-xl flex items-center justify-center shadow-purple-glow">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">MR Happy AI Assistant</h3>
                  <p className="text-hp-glass-200 text-sm mb-2">How can I help you today?</p>
                  <p className="text-hp-fuchsia-300 text-xs font-medium">"Task completed! Found relevant suggestions."</p>
                </div>
                <div className="w-10 h-10 bg-hp-glass-100 rounded-lg flex items-center justify-center group-hover:bg-hp-glass-200 transition-colors">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
              
              {/* Floating particles effect */}
              <div className="absolute inset-0 rounded-2xl-plus overflow-hidden pointer-events-none">
                <div className="absolute top-4 right-8 w-2 h-2 bg-hp-fuchsia-400 rounded-full animate-float"></div>
                <div className="absolute bottom-6 left-8 w-1 h-1 bg-hp-purple-400 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
              </div>
            </Link>
            
            <div className="text-center mt-4">
              <button className="text-hp-glass-300 text-sm hover:text-white transition-colors">
                Ask <span className="font-semibold">⌘K</span>
              </button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Quick Actions */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="px-6 mb-12"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Quick Actions</h2>
            <p className="text-hp-glass-300">Jump right into your most used features</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + (index * 0.1), duration: 0.6 }}
              >
                <Link
                  to={action.href}
                  className="group block p-6 bg-card-gradient hover:bg-card-gradient-hover border border-hp-glass-border rounded-xl-2 shadow-glass hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{action.name}</h3>
                    <p className="text-hp-glass-300 text-sm">{action.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Service Modules Grid */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="px-6 mb-12"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Explore Services</h2>
            <p className="text-hp-glass-300">Discover all the ways Happy Paisa can help you</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceModules.map((module, index) => (
              <motion.div
                key={module.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + (index * 0.05), duration: 0.6 }}
                className={module.featured ? 'md:col-span-2' : ''}
              >
                <Link
                  to={module.href}
                  className="group block h-full p-6 bg-card-gradient hover:bg-card-gradient-hover border border-hp-glass-border rounded-xl shadow-glass hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-hp-glass-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <module.icon className="w-6 h-6 text-hp-purple-400 group-hover:text-hp-fuchsia-400 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{module.name}</h3>
                        {module.featured && (
                          <span className="px-2 py-1 text-xs font-medium bg-hp-gradient-alt text-white rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-hp-glass-300 text-sm mb-3">{module.description}</p>
                      <div className="flex items-center text-hp-purple-400 group-hover:text-hp-fuchsia-400 transition-colors">
                        <span className="text-sm font-medium">Explore</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Recent Activity & Stats */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="px-6 pb-12"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-card-gradient border border-hp-glass-border rounded-xl shadow-glass p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-hp-purple-400" />
                    Recent Activity
                  </h3>
                  <Link to="/dashboard/activity" className="text-hp-purple-400 hover:text-hp-fuchsia-400 text-sm font-medium">
                    View All
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {[
                    { icon: Wallet, text: 'Payment received: ₹2,500', time: '2 hours ago', type: 'success' },
                    { icon: ShoppingBag, text: 'Order placed on Marketplace', time: '5 hours ago', type: 'info' },
                    { icon: Plane, text: 'Flight booking confirmed', time: '1 day ago', type: 'success' },
                    { icon: Brain, text: 'AI assistant helped with tax query', time: '2 days ago', type: 'ai' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-hp-glass-50 transition-colors">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activity.type === 'success' ? 'bg-success-gradient' :
                        activity.type === 'ai' ? 'bg-ai-gradient' : 'bg-hp-glass-100'
                      }`}>
                        <activity.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">{activity.text}</p>
                        <p className="text-hp-glass-300 text-xs">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <div className="bg-card-gradient border border-hp-glass-border rounded-xl shadow-glass p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-3 text-hp-success" />
                  This Month
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-hp-glass-300">Earnings</span>
                    <span className="text-hp-success font-semibold">₹12,450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-hp-glass-300">Transactions</span>
                    <span className="text-white font-semibold">43</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-hp-glass-300">Happy Points</span>
                    <span className="text-hp-fuchsia-400 font-semibold">2,150</span>
                  </div>
                </div>
              </div>

              <div className="bg-card-gradient border border-hp-glass-border rounded-xl shadow-glass p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-3 text-hp-fuchsia-400" />
                  Achievements
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-hp-gradient-alt rounded-lg flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Early Bird</p>
                      <p className="text-hp-glass-300 text-xs">First transaction of the day</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-success-gradient rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Power User</p>
                      <p className="text-hp-glass-300 text-xs">Used 5+ services this week</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}