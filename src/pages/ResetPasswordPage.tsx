import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, Check, AlertCircle } from 'lucide-react'
import { getSupabase } from '../lib/supabase'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  // Check if we have the necessary URL parameters
  useEffect(() => {
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    
    if (!accessToken || !refreshToken) {
      setError('Invalid or expired reset link. Please request a new password reset.')
    }
  }, [searchParams])

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = []
    
    if (pwd.length < 8) {
      errors.push('Must be at least 8 characters long')
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push('Must contain at least one uppercase letter')
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push('Must contain at least one lowercase letter')
    }
    if (!/\d/.test(pwd)) {
      errors.push('Must contain at least one number')
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      errors.push('Must contain at least one special character')
    }
    
    return errors
  }

  const handlePasswordChange = (pwd: string) => {
    setPassword(pwd)
    setValidationErrors(validatePassword(pwd))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const passwordErrors = validatePassword(password)
    if (passwordErrors.length > 0) {
      setError('Password does not meet requirements.')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const supabase = getSupabase()
      if (!supabase) {
        throw new Error('Authentication service not available. Please try again later.')
      }

      const accessToken = searchParams.get('access_token')
      const refreshToken = searchParams.get('refresh_token')
      
      if (!accessToken || !refreshToken) {
        throw new Error('Invalid or expired reset link. Please request a new password reset.')
      }

      // Set the session first
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      })

      if (sessionError) {
        throw sessionError
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) {
        throw updateError
      }

      setSuccess(true)
      
      // Redirect to sign in after 3 seconds
      setTimeout(() => {
        navigate('/signin')
      }, 3000)

    } catch (err: any) {
      console.error('Password reset error:', err)
      
      let errorMessage = 'Unable to reset password. Please try again.'
      
      if (err.message?.includes('expired')) {
        errorMessage = 'This reset link has expired. Please request a new password reset.'
      } else if (err.message?.includes('invalid')) {
        errorMessage = 'Invalid reset link. Please request a new password reset.'
      } else if (err.message?.includes('weak password')) {
        errorMessage = 'Password is too weak. Please choose a stronger password.'
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const accessToken = searchParams.get('access_token')
  const refreshToken = searchParams.get('refresh_token')
  const isValidLink = accessToken && refreshToken

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
          <h1 className="text-3xl font-bold text-white">Set New Password</h1>
          <p className="text-white/70 mt-2">
            {success 
              ? 'Password updated successfully!'
              : 'Choose a strong password for your account'
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
                <h3 className="text-xl font-semibold text-white mb-2">Password Updated!</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Your password has been successfully updated.<br />
                  You'll be redirected to sign in shortly.
                </p>
              </div>

              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-300 text-sm">
                  Redirecting to sign in page in 3 seconds...
                </p>
              </div>

              <Link
                to="/signin"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Sign In Now
              </Link>
            </div>
          ) : !isValidLink ? (
            /* Invalid Link State */
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full"
              >
                <AlertCircle className="w-8 h-8 text-red-400" />
              </motion.div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Invalid Reset Link</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  This password reset link is invalid or has expired.<br />
                  Please request a new password reset.
                </p>
              </div>

              <Link
                to="/forgot-password"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Request New Reset
              </Link>
            </div>
          ) : (
            /* Form State */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your new password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Requirements */}
                {password && (
                  <div className="mt-2 space-y-1">
                    {validationErrors.length > 0 && (
                      <div className="text-xs text-red-300">
                        {validationErrors.map((error, index) => (
                          <div key={index}>• {error}</div>
                        ))}
                      </div>
                    )}
                    {validationErrors.length === 0 && (
                      <div className="text-xs text-green-300">✓ Password meets all requirements</div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setError('')
                    }}
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Confirm your new password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {confirmPassword && password !== confirmPassword && (
                  <div className="mt-2 text-xs text-red-300">
                    Passwords do not match
                  </div>
                )}
                {confirmPassword && password === confirmPassword && (
                  <div className="mt-2 text-xs text-green-300">
                    ✓ Passwords match
                  </div>
                )}
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
                disabled={loading || validationErrors.length > 0 || password !== confirmPassword}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>

        {/* Navigation */}
        {!success && isValidLink && (
          <div className="mt-8 text-center">
            <Link
              to="/signin"
              className="text-white/60 hover:text-white/80 transition-colors"
            >
              ← Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}