import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { BookOpen, Mail, Lock, User, UserPlus, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface SignupPageProps {
  onSignup: (email: string, password: string, name: string) => Promise<void>
  onSwitchToLogin: () => void
  error: string
  onClearError?: () => void
}

export function SignupPage({ onSignup, onSwitchToLogin, error, onClearError }: SignupPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailCheckLoading, setEmailCheckLoading] = useState(false)
  const [emailExists, setEmailExists] = useState(false)

  // Log helpful info on page load
  useEffect(() => {
    console.log('📝 SIGNUP PAGE - Create a New Account')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('ℹ️  This page is for creating NEW accounts only')
    console.log('ℹ️  If you already have an account, click "Log in" below')
    console.log('ℹ️  The email field will automatically check if your email is already registered')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  }, [])

  // Check if email already exists (debounced)
  useEffect(() => {
    const checkEmail = async () => {
      if (!email || email.length < 5 || !email.includes('@')) {
        setEmailExists(false)
        return
      }

      setEmailCheckLoading(true)
      try {
        const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-62ce5e0f`
        const res = await fetch(`${serverUrl}/check-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ email })
        })

        const data = await res.json()
        const exists = data.exists || false
        setEmailExists(exists)
        
        if (exists) {
          console.log(`⚠️  Email Check: "${email}" already has an account`)
          console.log(`💡 Action Required: Click "Login with This Email" to access your existing account`)
          console.log(`💡 Alternative: Use a different email address to create a new account`)
        } else {
          console.log(`✅ Email Check: "${email}" is available for signup`)
        }
      } catch (error) {
        console.log('Email check error:', error)
        setEmailExists(false)
      } finally {
        setEmailCheckLoading(false)
      }
    }

    const timer = setTimeout(checkEmail, 800)
    return () => clearTimeout(timer)
  }, [email])

  const validatePassword = (pwd: string): boolean => {
    setPasswordError('')
    
    if (pwd.length === 0) return true // Don't show error for empty password
    
    if (pwd.length > 15) {
      setPasswordError('Password must not exceed 15 characters')
      return false
    }
    
    const hasLetter = /[a-zA-Z]/.test(pwd)
    const hasNumber = /\d/.test(pwd)
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
    
    if (!hasLetter || !hasNumber || !hasSpecialChar) {
      setPasswordError('Password must contain letters, numbers, and special characters')
      return false
    }
    
    return true
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    validatePassword(newPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if email already exists
    if (emailExists) {
      console.log('⚠️  Cannot signup: Email already exists')
      return // Prevent form submission
    }
    
    if (!validatePassword(password)) {
      return
    }
    
    onClearError?.()
    setLoading(true)
    try {
      await onSignup(email, password, name)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-300 to-purple-300 rounded-2xl mb-4"
            >
              <BookOpen className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-gray-900 dark:text-white mb-2">Join Study Planner</h1>
            <p className="text-gray-600 dark:text-gray-400">Start your journey to better grades</p>
          </div>

          {/* Info Banner */}
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl">
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              <strong>New here?</strong> Create your account below. Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="underline hover:text-blue-500"
              >
                Login here
              </button>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
            >
              {(error.toLowerCase().includes('already') || error.toLowerCase().includes('registered') || error.toLowerCase().includes('exists')) ? (
                <div>
                  <p className="text-red-700 dark:text-red-300 mb-3">
                    <strong>Email Already in Use</strong>
                  </p>
                  <p className="text-red-600 dark:text-red-400 text-sm mb-3">
                    An account with this email address already exists. You can either:
                  </p>
                  <div className="space-y-2">
                    <Button
                      type="button"
                      onClick={onSwitchToLogin}
                      className="w-full bg-gradient-to-r from-blue-300 to-purple-300 hover:from-blue-400 hover:to-purple-400 text-white"
                    >
                      Login with This Email →
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setEmail('')
                        onClearError?.()
                      }}
                      variant="outline"
                      className="w-full text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      Try a Different Email
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-red-600 dark:text-red-400">{error}</p>
              )}
            </motion.div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    onClearError?.()
                  }}
                  className={`pl-10 pr-10 bg-gray-50 ${
                    emailExists 
                      ? 'border-red-500 focus:border-red-500' 
                      : email.length > 5 && !emailCheckLoading 
                      ? 'border-green-500 focus:border-green-500' 
                      : 'border-gray-200'
                  }`}
                  required
                />
                {email.length > 5 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {emailCheckLoading ? (
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                    ) : emailExists ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {emailExists && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <p className="text-red-700 dark:text-red-300 text-sm mb-2">
                    <strong>⚠️ This email is already registered!</strong>
                  </p>
                  <p className="text-red-600 dark:text-red-400 text-sm mb-3">
                    An account with this email already exists. You can:
                  </p>
                  <div className="space-y-2">
                    <Button
                      type="button"
                      onClick={onSwitchToLogin}
                      size="sm"
                      className="w-full bg-gradient-to-r from-blue-300 to-purple-300 hover:from-blue-400 hover:to-purple-400 text-white"
                    >
                      Login with This Email →
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setEmail('')
                        onClearError?.()
                      }}
                      size="sm"
                      variant="outline"
                      className="w-full text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                    >
                      Use a Different Email
                    </Button>
                  </div>
                </motion.div>
              )}
              {email.length > 5 && !emailCheckLoading && !emailExists && (
                <p className="text-green-600 dark:text-green-400 text-sm flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  This email is available
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                  className={`pl-10 pr-10 bg-gray-50 border-gray-200 ${passwordError ? 'border-red-500' : ''}`}
                  required
                  maxLength={15}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {passwordError ? (
                <p className="text-red-600 dark:text-red-400 text-sm">{passwordError}</p>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">Letters, numbers, special characters (max 15)</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || emailExists || emailCheckLoading}
              className="w-full bg-gradient-to-r from-blue-300 to-purple-300 hover:from-blue-400 hover:to-purple-400 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Creating account...</span>
              ) : emailExists ? (
                <span>Email Already Registered</span>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Sign Up
                </>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-blue-400 hover:text-blue-500"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
