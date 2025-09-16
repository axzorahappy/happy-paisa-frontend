import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSupabase } from '../lib/supabase'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = getSupabase()
        if (!supabase) {
          throw new Error('Supabase not configured')
        }

        // Handle the authentication callback from email verification
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          setStatus('error')
          setMessage('Failed to verify email. Please try again.')
          setTimeout(() => navigate('/signin'), 3000)
          return
        }

        if (data.session) {
          console.log('Email verified successfully, user authenticated')
          setStatus('success')
          setMessage('Email verified successfully! Redirecting to dashboard...')
          setTimeout(() => navigate('/dashboard'), 2000)
        } else {
          console.log('No session found, redirecting to signin')
          setStatus('success')
          setMessage('Email verified! Please sign in to continue.')
          setTimeout(() => navigate('/signin'), 2000)
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage('An error occurred during verification. Please try again.')
        setTimeout(() => navigate('/signin'), 3000)
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 mb-6">
            {status === 'loading' && (
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
            )}
            {status === 'success' && (
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">
            {status === 'loading' && 'Verifying Email...'}
            {status === 'success' && 'Verification Complete!'}
            {status === 'error' && 'Verification Failed'}
          </h2>
          
          <p className="text-white/80 mb-6">
            {message}
          </p>
          
          {status === 'loading' && (
            <p className="text-sm text-white/60">
              Please wait while we verify your email address.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthCallback