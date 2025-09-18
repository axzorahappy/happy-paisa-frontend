import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  MessageSquare, 
  Zap, 
  TrendingUp, 
  BarChart3, 
  Calculator, 
  FileText, 
  Search, 
  Send,
  Sparkles,
  Clock,
  Bot,
  Lightbulb,
  Target,
  PieChart,
  DollarSign
} from 'lucide-react';

export default function AIHub() {
  const [chatMessage, setChatMessage] = useState('');

  const aiServices = [
    {
      name: 'Smart Finance Advisor',
      description: 'Get personalized financial advice and investment recommendations',
      icon: TrendingUp,
      gradient: 'from-hp-purple-500 to-hp-fuchsia-500',
      features: ['Investment Tips', 'Budget Planning', 'Tax Advice']
    },
    {
      name: 'Expense Analyzer',
      description: 'Analyze your spending patterns and get insights',
      icon: BarChart3,
      gradient: 'from-hp-fuchsia-500 to-hp-pink-500',
      features: ['Spending Insights', 'Category Analysis', 'Savings Goals']
    },
    {
      name: 'Bill Calculator',
      description: 'Smart calculations for bills, taxes, and payments',
      icon: Calculator,
      gradient: 'from-hp-success to-emerald-400',
      features: ['Tax Calculator', 'EMI Calculator', 'Split Bills']
    },
    {
      name: 'Document Assistant',
      description: 'AI-powered document analysis and processing',
      icon: FileText,
      gradient: 'from-hp-info to-blue-400',
      features: ['OCR Scanning', 'Data Extraction', 'Form Filling']
    }
  ];

  const recentInteractions = [
    {
      query: 'How can I save more money this month?',
      response: 'Based on your spending, you can save ₹3,500 by reducing dining out...',
      time: '2 hours ago',
      type: 'finance'
    },
    {
      query: 'Calculate my tax liability for this year',
      response: 'Your estimated tax liability is ₹45,000 based on your income...',
      time: '5 hours ago',
      type: 'tax'
    },
    {
      query: 'Best investment options for ₹50,000?',
      response: 'Consider diversified mutual funds with 60% equity and 40% debt...',
      time: '1 day ago',
      type: 'investment'
    }
  ];

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
              <div className="w-12 h-12 bg-ai-gradient rounded-xl flex items-center justify-center shadow-ai-glow">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">AI Hub</h1>
                <p className="text-hp-glass-300">Your intelligent financial assistant powered by AI</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="px-4 py-2 bg-hp-glass-100 rounded-lg">
                <span className="text-hp-success font-semibold">AI Active</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Quick Chat Interface */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="px-6 py-8"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-ai-gradient border border-hp-glass-border rounded-xl-2 shadow-ai-glow p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-hp-gradient-alt rounded-xl flex items-center justify-center animate-glow">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Mr Happy AI Assistant</h2>
                <p className="text-hp-glass-200">Ready to help with your questions</p>
              </div>
            </div>
            
            <div className="relative">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask me anything about finance, investments, or calculations..."
                className="w-full pl-6 pr-16 py-4 bg-hp-glass-100 border border-hp-glass-border rounded-xl text-white placeholder-hp-glass-300 focus:outline-none focus:border-hp-purple-400 focus:ring-1 focus:ring-hp-purple-400 transition-colors"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-hp-gradient-alt hover:shadow-purple-glow rounded-lg transition-all duration-300">
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                'Calculate EMI for ₹10L loan',
                'Best savings account options',
                'Tax saving investments',
                'Analyze my expenses'
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setChatMessage(suggestion)}
                  className="px-3 py-1.5 bg-hp-glass-100 hover:bg-hp-glass-200 text-hp-glass-200 hover:text-white text-sm rounded-lg transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* AI Services Grid */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="px-6 mb-12"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center">
              <Sparkles className="w-6 h-6 mr-3 text-hp-fuchsia-400" />
              AI-Powered Services
            </h2>
            <p className="text-hp-glass-300 mt-2">Intelligent tools to simplify your financial life</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiServices.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (index * 0.1), duration: 0.6 }}
                className="group bg-card-gradient hover:bg-card-gradient-hover border border-hp-glass-border rounded-xl shadow-glass hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 p-6"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-hp-purple-300 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-hp-glass-300 text-sm mb-4">{service.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.features.map((feature) => (
                        <span key={feature} className="px-2 py-1 bg-hp-glass-100 text-hp-glass-200 text-xs rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <button className="flex items-center space-x-2 text-hp-purple-400 hover:text-hp-fuchsia-400 font-medium transition-colors">
                      <span>Try Now</span>
                      <Zap className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Recent Interactions & AI Insights */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="px-6 pb-12"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Interactions */}
            <div className="bg-card-gradient border border-hp-glass-border rounded-xl shadow-glass p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-3 text-hp-purple-400" />
                  Recent Interactions
                </h3>
                <button className="text-hp-purple-400 hover:text-hp-fuchsia-400 text-sm font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {recentInteractions.map((interaction, index) => (
                  <div key={index} className="p-4 bg-hp-glass-50 rounded-lg hover:bg-hp-glass-100 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        interaction.type === 'finance' ? 'bg-success-gradient' :
                        interaction.type === 'tax' ? 'bg-warning-gradient' : 'bg-ai-gradient'
                      }`}>
                        {interaction.type === 'finance' ? <DollarSign className="w-4 h-4 text-white" /> :
                         interaction.type === 'tax' ? <Calculator className="w-4 h-4 text-white" /> :
                         <TrendingUp className="w-4 h-4 text-white" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm mb-1">{interaction.query}</p>
                        <p className="text-hp-glass-300 text-xs mb-2 line-clamp-2">{interaction.response}</p>
                        <span className="text-hp-glass-400 text-xs">{interaction.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="space-y-6">
              <div className="bg-card-gradient border border-hp-glass-border rounded-xl shadow-glass p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-3 text-hp-fuchsia-400" />
                  AI Insights
                </h3>
                <div className="space-y-4">
                  <div className="p-3 bg-success-gradient rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-white" />
                      <span className="text-white font-medium text-sm">Savings Goal</span>
                    </div>
                    <p className="text-white text-sm">You're 67% towards your ₹1L emergency fund goal</p>
                  </div>
                  
                  <div className="p-3 bg-warning-gradient rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <PieChart className="w-4 h-4 text-white" />
                      <span className="text-white font-medium text-sm">Expense Alert</span>
                    </div>
                    <p className="text-white text-sm">Your dining expenses increased by 25% this month</p>
                  </div>
                  
                  <div className="p-3 bg-ai-gradient rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="w-4 h-4 text-white" />
                      <span className="text-white font-medium text-sm">AI Suggestion</span>
                    </div>
                    <p className="text-white text-sm">Consider investing ₹5,000 monthly in tax-saving funds</p>
                  </div>
                </div>
              </div>

              {/* AI Usage Stats */}
              <div className="bg-card-gradient border border-hp-glass-border rounded-xl shadow-glass p-6">
                <h3 className="text-lg font-semibold text-white mb-4">This Month</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-hp-glass-300">Questions Asked</span>
                    <span className="text-white font-semibold">47</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-hp-glass-300">AI Suggestions</span>
                    <span className="text-hp-fuchsia-400 font-semibold">23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-hp-glass-300">Time Saved</span>
                    <span className="text-hp-success font-semibold">2.5 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* AI Features Coming Soon */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="px-6 pb-12 bg-hp-glass-50/20"
      >
        <div className="max-w-7xl mx-auto py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center">
              <Clock className="w-6 h-6 mr-3 text-hp-purple-400" />
              Coming Soon
            </h2>
            <p className="text-hp-glass-300 mt-2">Exciting AI features in development</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Voice Assistant',
                description: 'Talk to Mr Happy using voice commands',
                icon: '🎤',
                eta: 'Q1 2024'
              },
              {
                name: 'Predictive Analytics',
                description: 'AI-powered financial forecasting',
                icon: '📊',
                eta: 'Q2 2024'
              },
              {
                name: 'Smart Automation',
                description: 'Automated bill payments and investments',
                icon: '⚡',
                eta: 'Q2 2024'
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + (index * 0.1), duration: 0.6 }}
                className="bg-card-gradient border border-hp-glass-border rounded-xl shadow-glass p-6 text-center opacity-75"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.name}</h3>
                <p className="text-hp-glass-300 text-sm mb-4">{feature.description}</p>
                <span className="px-3 py-1 bg-hp-glass-100 text-hp-glass-200 text-xs font-medium rounded-full">
                  {feature.eta}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}