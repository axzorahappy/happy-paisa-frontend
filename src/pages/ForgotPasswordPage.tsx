import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, Check, Send } from 'lucide-react'
import { getSupabase } from '../lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const supabase = getSupabase()
      if (!supabase) {
        throw new Error('Authentication service not available. Please try again later.')
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        throw error
      }

      setSuccess(true)
    } catch (err: any) {
      console.error('Password reset error:', err)
      
      let errorMessage = 'Unable to send reset email. Please try again.'
      
      if (err.message?.includes('rate limit')) {
        errorMessage = 'Too many requests. Please wait a few minutes before trying again.'
      } else if (err.message?.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.'
      } else if (err.message?.includes('User not found')) {
        errorMessage = 'No account found with this email address.'
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4"
          >
            <span className="text-2xl font-bold text-white">HP</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-white/70 mt-2">
            {success 
              ? 'Check your email for reset instructions'
              : 'Enter your email to receive reset instructions'
            }
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20"
        >
          {success ? (
            /* Success State */
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full"
              >
                <Check className="w-8 h-8 text-green-400" />
              </motion.div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Email Sent!</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  We've sent password reset instructions to <br />
                  <span className="text-purple-300 font-medium">{email}</span>
                </p>
              </div>

              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-left">
                <h4 className="text-blue-300 font-medium mb-2">Next Steps:</h4>
                <ul className="text-blue-200/80 text-sm space-y-1">
                  <li>• Check your email inbox</li>
                  <li>• Look for an email from Happy Paisa</li>
                  <li>• Click the reset link in the email</li>
                  <li>• Create your new password</li>
                </ul>
              </div>

              <div className="text-center text-sm text-white/60">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => {
                    setSuccess(false)
                    setEmail('')
                  }}
                  className="text-purple-400 hover:text-purple-300 transition-colors underline"
                >
                  try again
                </button>
              </div>
            </div>
          ) : (
            /* Form State */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError('') // Clear error when user types
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email address"
                    required
                    disabled={loading}
                  />
                </div>
                <p className="mt-2 text-xs text-white/60">
                  Enter the email address associated with your Happy Paisa account
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Reset Instructions</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link
            to="/signin"
            className="inline-flex items-center space-x-2 text-white/60 hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-white/50 text-sm">
            Need help?{' '}
            <a 
              href="mailto:support@happypaisa.com" 
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}