import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { BookOpen, Mail, Lock, LogIn, Eye, EyeOff, HelpCircle } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { DebugHelper } from './DebugHelper'
import { QuickStartGuide } from './QuickStartGuide'
import { LoginHelperPanel } from './LoginHelperPanel'

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>
  onSwitchToSignup: () => void
  error: string
  onClearError?: () => void
}

export function LoginPage({ onLogin, onSwitchToSignup, error, onClearError }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showDebugHelper, setShowDebugHelper] = useState(false)
  const [showQuickStart, setShowQuickStart] = useState(false)
  const debugHelperRef = React.useRef<HTMLDivElement>(null)

  // Log helpful info on page load
  React.useEffect(() => {
    console.log('%c🔐 LOGIN PAGE - Sign In to Your Account', 'font-size: 16px; font-weight: bold; color: #8b5cf6')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('%c📌 IMPORTANT:', 'font-weight: bold; color: #f59e0b')
    console.log('  • This page is for EXISTING accounts only')
    console.log('  • First time? Click "Sign up" to create an account')
    console.log('  • Having issues? Look for helpful guides on the page')
    console.log('')
    console.log('%c🛠️  DEBUGGING FEATURES:', 'font-weight: bold; color: #3b82f6')
    console.log('  ✓ Real-time input validation (shows as you type)')
    console.log('  ✓ "Check if My Email Has an Account" button (after login fails)')
    console.log('  ✓ Automatic space trimming from email/password')
    console.log('  ✓ Password visibility toggle ("Show password" button)')
    console.log('  ✓ Quick Start Guide (appears after failed login)')
    console.log('')
    console.log('%c💡 COMMON ISSUES & SOLUTIONS:', 'font-weight: bold; color: #10b981')
    console.log('  ❌ Issue: "Invalid email or password"')
    console.log('     → Solution: Check if account exists using the debug tool')
    console.log('')
    console.log('  ❌ Issue: Account exists but still can\'t login')
    console.log('     → Solution: Verify password is correct (case-sensitive!)')
    console.log('     → Solution: Use "Show password" to see what you typed')
    console.log('     → Solution: Check for Caps Lock')
    console.log('')
    console.log('  ❌ Issue: Account doesn\'t exist')
    console.log('     → Solution: Click "Create New Account" to sign up')
    console.log('')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  }, [])

  // Show quick start guide when there's an error
  React.useEffect(() => {
    if (error) {
      setShowQuickStart(true)
    }
  }, [error])

  // Scroll to debug helper when it opens
  React.useEffect(() => {
    if (showDebugHelper && debugHelperRef.current) {
      setTimeout(() => {
        debugHelperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 100)
    }
  }, [showDebugHelper])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onClearError?.()
    
    // Trim whitespace from email and password
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()
    
    console.log('🔐 LOGIN ATTEMPT')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`Email entered: "${trimmedEmail}"`)
    console.log(`Password length: ${trimmedPassword.length}`)
    console.log(`Email has spaces: ${trimmedEmail.includes(' ') ? 'YES ⚠️' : 'NO ✓'}`)
    if (email !== trimmedEmail) {
      console.log('⚠️  Note: Extra spaces removed from email')
    }
    if (password !== trimmedPassword) {
      console.log('⚠️  Note: Extra spaces removed from password')
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    setLoading(true)
    try {
      await onLogin(trimmedEmail, trimmedPassword)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200 flex items-center justify-center p-4">
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
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-300 to-pink-300 rounded-2xl mb-4"
            >
              <BookOpen className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-gray-900 dark:text-white mb-2">Smart Study Planner</h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome back! Log in to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
            >
              {(error.toLowerCase().includes('invalid') || 
                error.toLowerCase().includes('credentials') || 
                error.toLowerCase().includes('password')) ? (
                <div>
                  <p className="text-red-700 dark:text-red-300 mb-3">
                    <strong>Login Failed</strong>
                  </p>
                  <p className="text-red-600 dark:text-red-400 text-sm mb-3">
                    The email or password you entered is incorrect. Please check:
                  </p>
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-3 mb-3">
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                      <strong>Common issues to check:</strong>
                    </p>
                    <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span><strong>Email typo:</strong> Check for extra spaces or misspellings</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span><strong>Wrong password:</strong> Passwords are case-sensitive (check Caps Lock)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span><strong>No account:</strong> You may need to sign up first</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span><strong>Different email:</strong> Did you use a different email when signing up?</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <Button
                      type="button"
                      onClick={() => {
                        setPassword('')
                        onClearError?.()
                      }}
                      variant="outline"
                      className="w-full text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      Clear & Try Again
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowDebugHelper(true)}
                      variant="outline"
                      className="w-full text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      🔍 Check if My Email Has an Account
                    </Button>
                    <Button
                      type="button"
                      onClick={onSwitchToSignup}
                      className="w-full bg-gradient-to-r from-blue-300 to-purple-300 hover:from-blue-400 hover:to-purple-400 text-white"
                    >
                      Create New Account Instead →
                    </Button>
                  </div>
                </div>
              ) : (error.toLowerCase().includes('no account') || error.toLowerCase().includes('sign up')) ? (
                <div>
                  <p className="text-red-700 dark:text-red-300 mb-3">
                    <strong>Account Not Found</strong>
                  </p>
                  <p className="text-red-600 dark:text-red-400 text-sm mb-3">
                    We couldn't find an account with this email. You'll need to create one first.
                  </p>
                  <Button
                    type="button"
                    onClick={onSwitchToSignup}
                    className="w-full bg-gradient-to-r from-blue-300 to-purple-300 hover:from-blue-400 hover:to-purple-400 text-white"
                  >
                    Create Your Account →
                  </Button>
                </div>
              ) : (
                <p className="text-red-600 dark:text-red-400">{error}</p>
              )}
            </motion.div>
          )}

          {/* Quick Start Guide */}
          <AnimatePresence>
            {showQuickStart && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4"
              >
                <QuickStartGuide />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Real-time validation helper */}
            <LoginHelperPanel email={email} password={password} />

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {password && !showPassword && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(true)}
                    className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400"
                  >
                    Show password
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-gray-50 border-gray-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {password && showPassword && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ℹ️ Currently visible: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">{password}</span>
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-300 to-pink-300 hover:from-purple-400 hover:to-pink-400 text-white"
            >
              {loading ? (
                <span>Logging in...</span>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Log In
                </>
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignup}
                className="text-purple-400 hover:text-purple-500"
              >
                Sign up
              </button>
            </p>
          </div>

          {/* Troubleshooting Link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowDebugHelper(!showDebugHelper)}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 flex items-center gap-1 mx-auto"
            >
              <HelpCircle className="w-4 h-4" />
              {showDebugHelper ? 'Hide' : 'Having trouble logging in?'}
            </button>
          </div>
        </div>

        {/* Debug Helper - Shows below the login card */}
        <AnimatePresence>
          {showDebugHelper && (
            <motion.div
              ref={debugHelperRef}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6"
            >
              <DebugHelper defaultEmail={email} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
