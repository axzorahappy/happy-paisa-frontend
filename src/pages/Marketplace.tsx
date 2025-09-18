import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, Filter, Star, Heart, ShoppingCart, TrendingUp, Tag, Zap } from 'lucide-react';

export default function Marketplace() {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-6 py-8 border-b border-hp-glass-border"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-hp-gradient-alt rounded-xl flex items-center justify-center shadow-purple-glow">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Marketplace</h1>
                <p className="text-hp-glass-300">Discover products, services and amazing deals</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-2.5 bg-hp-glass-100 hover:bg-hp-glass-200 rounded-lg transition-colors">
                <Heart className="w-5 h-5 text-white" />
              </button>
              <button className="p-2.5 bg-hp-glass-100 hover:bg-hp-glass-200 rounded-lg transition-colors">
                <ShoppingCart className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Search & Filters */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="px-6 py-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-hp-glass-300" />
              <input
                type="text"
                placeholder="Search products, services, brands..."
                className="w-full pl-12 pr-4 py-3 bg-hp-glass-50 border border-hp-glass-border rounded-lg text-white placeholder-hp-glass-300 focus:outline-none focus:border-hp-purple-400 focus:ring-1 focus:ring-hp-purple-400 transition-colors"
              />
            </div>
            <button className="flex items-center space-x-2 px-6 py-3 bg-hp-glass-100 hover:bg-hp-glass-200 border border-hp-glass-border rounded-lg transition-colors">
              <Filter className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Filters</span>
            </button>
          </div>

          {/* Categories */}
          <div className="flex space-x-4 mb-8 overflow-x-auto">
            {[
              { name: 'All', active: true },
              { name: 'Electronics' },
              { name: 'Fashion' },
              { name: 'Home & Garden' },
              { name: 'Sports' },
              { name: 'Books' },
              { name: 'Services' },
            ].map((category) => (
              <button
                key={category.name}
                className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-colors ${
                  category.active
                    ? 'bg-hp-gradient-alt text-white shadow-purple-glow'
                    : 'bg-hp-glass-50 text-hp-glass-300 hover:bg-hp-glass-100 hover:text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Deals */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="px-6 mb-12"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Zap className="w-6 h-6 mr-3 text-hp-fuchsia-400" />
              Flash Deals
            </h2>
            <span className="text-hp-glass-300 text-sm">Ends in 2h 35m</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Wireless Headphones',
                price: '₹2,999',
                originalPrice: '₹4,999',
                discount: '40% OFF',
                rating: 4.5,
                image: '/api/placeholder/300/300'
              },
              {
                title: 'Smart Watch',
                price: '₹8,999',
                originalPrice: '₹12,999',
                discount: '30% OFF',
                rating: 4.7,
                image: '/api/placeholder/300/300'
              },
              {
                title: 'Laptop Stand',
                price: '₹1,299',
                originalPrice: '₹1,999',
                discount: '35% OFF',
                rating: 4.3,
                image: '/api/placeholder/300/300'
              },
              {
                title: 'Gaming Mouse',
                price: '₹1,999',
                originalPrice: '₹2,999',
                discount: '33% OFF',
                rating: 4.6,
                image: '/api/placeholder/300/300'
              },
            ].map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (index * 0.1), duration: 0.6 }}
                className="group bg-card-gradient hover:bg-card-gradient-hover border border-hp-glass-border rounded-xl shadow-glass hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="relative">
                  <div className="w-full h-48 bg-hp-glass-100 flex items-center justify-center">
                    <ShoppingBag className="w-16 h-16 text-hp-glass-300" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-hp-error text-white text-xs font-bold rounded-full">
                      {product.discount}
                    </span>
                  </div>
                  <button className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-hp-glass-200 rounded-full transition-colors">
                    <Heart className="w-4 h-4 text-white" />
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2 group-hover:text-hp-purple-300 transition-colors">
                    {product.title}
                  </h3>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-hp-glass-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-hp-glass-300 text-sm">({product.rating})</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-xl font-bold text-hp-success">{product.price}</span>
                    <span className="text-sm text-hp-glass-300 line-through">{product.originalPrice}</span>
                  </div>
                  
                  <button className="w-full py-2.5 bg-hp-gradient-alt hover:shadow-purple-glow text-white font-medium rounded-lg transition-all duration-300 hover:scale-105">
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Categories Grid */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="px-6 pb-12"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Tag className="w-6 h-6 mr-3 text-hp-purple-400" />
              Browse Categories
            </h2>
            <button className="text-hp-purple-400 hover:text-hp-fuchsia-400 font-medium">
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Electronics', icon: '📱', count: '2.5k+' },
              { name: 'Fashion', icon: '👕', count: '1.8k+' },
              { name: 'Home', icon: '🏠', count: '950+' },
              { name: 'Sports', icon: '⚽', count: '1.2k+' },
              { name: 'Books', icon: '📚', count: '800+' },
              { name: 'Health', icon: '💊', count: '600+' },
            ].map((category, index) => (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + (index * 0.05), duration: 0.6 }}
                className="group p-6 bg-card-gradient hover:bg-card-gradient-hover border border-hp-glass-border rounded-xl shadow-glass hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-white font-semibold mb-1 group-hover:text-hp-purple-300 transition-colors">
                  {category.name}
                </h3>
                <p className="text-hp-glass-300 text-sm">{category.count} items</p>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Trending Products */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="px-6 pb-12 bg-hp-glass-50/30"
      >
        <div className="max-w-7xl mx-auto py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center">
              <TrendingUp className="w-6 h-6 mr-3 text-hp-fuchsia-400" />
              Trending Now
            </h2>
            <p className="text-hp-glass-300 mt-2">Most popular products this week</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }, (_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + (index * 0.05), duration: 0.6 }}
                className="group bg-card-gradient hover:bg-card-gradient-hover border border-hp-glass-border rounded-lg shadow-glass hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="w-full h-32 bg-hp-glass-100 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-hp-glass-300" />
                </div>
                <div className="p-3">
                  <h4 className="text-white font-medium text-sm mb-1 group-hover:text-hp-purple-300 transition-colors">
                    Product {index + 1}
                  </h4>
                  <p className="text-hp-success font-semibold">₹{(Math.random() * 5000 + 500).toFixed(0)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}