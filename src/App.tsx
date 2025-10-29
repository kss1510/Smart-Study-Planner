import { useState, useEffect, useMemo } from 'react'
import { supabase } from './utils/supabase/client'
import { projectId, publicAnonKey } from './utils/supabase/info'
import { motion, AnimatePresence } from 'motion/react'
import { 
  LayoutDashboard, 
  CheckSquare, 
  Timer, 
  Calendar, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react'
import { LoginPage } from './components/LoginPage'
import { SignupPage } from './components/SignupPage'
import { Dashboard } from './components/Dashboard'
import { TaskManager } from './components/TaskManager'
import { FocusTimer } from './components/FocusTimer'
import { StudyScheduler } from './components/StudyScheduler'
import { Analytics } from './components/Analytics'
import { DashboardSkeleton, TasksSkeleton, AnalyticsSkeleton } from './components/SkeletonLoader'
import { Button } from './components/ui/button'
import { Toaster } from './components/ui/sonner'
import { toast } from 'sonner@2.0.3'
import { ThemeProvider, useTheme } from './utils/ThemeContext'

type AuthView = 'login' | 'signup'
type MainView = 'dashboard' | 'tasks' | 'timer' | 'scheduler' | 'analytics'

function AppContent() {
  const { theme, toggleTheme } = useTheme()
  const [authView, setAuthView] = useState<AuthView>('login')
  const [mainView, setMainView] = useState<MainView>('dashboard')
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [userName, setUserName] = useState('')
  const [authError, setAuthError] = useState('')
  const [tasks, setTasks] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-62ce5e0f`

  // Memoize upcomingTasks calculation - must be before conditional returns
  const upcomingTasks = useMemo(
    () => tasks
      .filter(t => !t.completed)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()),
    [tasks]
  )

  // Check session on mount
  useEffect(() => {
    checkSession()
  }, [])

  // Fetch data when logged in
  useEffect(() => {
    if (accessToken) {
      fetchData()
    }
  }, [accessToken])

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        setAccessToken(session.access_token)
        setUserName(session.user.user_metadata?.name || 'Student')
      }
    } catch (error) {
      console.log('Session check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchData = async (skipLoading = false) => {
    if (!accessToken) return

    if (!skipLoading) setDataLoading(true)
    
    try {
      // Use batched endpoint for faster loading - single request instead of 3
      const res = await fetch(`${serverUrl}/all-data`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      
      const data = await res.json()
      
      if (data.tasks) setTasks(data.tasks)
      if (data.sessions) setSessions(data.sessions)
      if (data.analytics) setAnalytics(data.analytics)
    } catch (error) {
      console.log('Fetch data error:', error)
    } finally {
      if (!skipLoading) setDataLoading(false)
    }
  }

  const handleLogin = async (email: string, password: string) => {
    setAuthError('')
    try {
      console.log(`🔑 Attempting login for: ${email}`)
      console.log(`📧 Email length: ${email.length}, Password length: ${password.length}`)
      
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.log('❌ Login error:', error.message)
        console.log('Error status:', error.status)
        console.log('Full error object:', JSON.stringify(error, null, 2))
        
        // Provide more user-friendly error messages
        const errorMsg = error.message.toLowerCase()
        if (errorMsg.includes('invalid login credentials') || 
            errorMsg.includes('invalid credentials') ||
            errorMsg.includes('invalid email or password')) {
          console.log('⚠️  Login failed: Invalid credentials for', email)
          console.log('')
          console.log('🔍 TROUBLESHOOTING GUIDE')
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
          console.log('This error means the email/password combination is incorrect.')
          console.log('')
          console.log('📋 Next Steps:')
          console.log('  1️⃣  Click "Check if My Email Has an Account" button on the login page')
          console.log('  2️⃣  If account EXISTS: Double-check your password (case-sensitive!)')
          console.log('  3️⃣  If account DOES NOT EXIST: Click "Create New Account"')
          console.log('  4️⃣  Make sure there are no extra spaces in email/password')
          console.log('')
          console.log('💡 Common Issues:')
          console.log('  • Caps Lock is ON (passwords are case-sensitive)')
          console.log('  • Extra space at the start/end of email or password')
          console.log('  • Used different email for signup vs login')
          console.log('  • Misremembered password - you may need to create new account')
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
          throw new Error('Invalid email or password. Please check your credentials or sign up for a new account.')
        } else if (errorMsg.includes('email not confirmed')) {
          console.log('⚠️  Login failed: Email not confirmed for', email)
          throw new Error('Please confirm your email address before logging in.')
        } else if (errorMsg.includes('user not found')) {
          console.log('⚠️  Login failed: User not found for', email)
          throw new Error('No account found with this email. Please sign up first.')
        }
        throw new Error(error.message)
      }

      if (!session?.access_token) {
        console.log('❌ Login failed: No access token received')
        throw new Error('Login failed. Please try again.')
      }

      setAccessToken(session.access_token)
      setUserName(session.user.user_metadata?.name || 'Student')
      console.log('✅ Login successful for:', email)
      console.log('User ID:', session.user.id)
      console.log('User metadata:', session.user.user_metadata)
    } catch (error: any) {
      console.log('Login error details:', error)
      setAuthError(error.message || 'Failed to log in. Please try again.')
      throw error
    }
  }

  const handleSignup = async (email: string, password: string, name: string) => {
    setAuthError('')
    try {
      console.log(`📝 Starting signup process for: ${email}`)
      console.log(`Name: ${name}`)
      console.log(`Password length: ${password.length}`)
      
      const res = await fetch(`${serverUrl}/signup`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, password, name })
      })

      const data = await res.json()
      console.log('Server response status:', res.status)
      console.log('Server response data:', data)
      
      if (!res.ok || data.error) {
        if (res.status === 409) {
          console.log(`⚠️  Email already registered: ${email}`)
          console.log(`💡 TIP: If you already have an account, use the Login page instead.`)
          console.log(`💡 TIP: If this is a mistake, try a different email address.`)
        } else {
          console.log(`❌ Signup server error for ${email}:`, data.error)
        }
        throw new Error(data.error || 'Failed to sign up')
      }

      console.log('✅ Signup successful for:', email, '- User created, now logging in...')
      // Add a small delay to ensure user is fully created in the database
      await new Promise(resolve => setTimeout(resolve, 500))
      console.log('Attempting automatic login...')
      await handleLogin(email, password)
    } catch (error: any) {
      console.log('Signup error details:', error)
      setAuthError(error.message || 'Failed to sign up. Please try again.')
      throw error
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setAccessToken(null)
    setUserName('')
    setTasks([])
    setSessions([])
    setAnalytics(null)
    setMainView('dashboard')
  }

  const handleAddTask = async (task: any) => {
    // Optimistic update - add task immediately to UI
    const optimisticTask = {
      id: `temp-${Date.now()}`,
      ...task,
      completed: false,
      createdAt: new Date().toISOString()
    }
    setTasks(prev => [...prev, optimisticTask])
    toast.success('Task added successfully!', { duration: 2000 })

    try {
      const res = await fetch(`${serverUrl}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(task)
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        // Revert optimistic update on error
        setTasks(prev => prev.filter(t => t.id !== optimisticTask.id))
        toast.error(data.error || 'Failed to add task')
        throw new Error(data.error || 'Failed to add task')
      }

      // Replace temporary task with real one from server
      setTasks(prev => prev.map(t => t.id === optimisticTask.id ? data.task : t))
      
      // Refresh data in background without showing loading state
      fetchData(true)
    } catch (error) {
      console.log('Add task error:', error)
      throw error
    }
  }

  const handleUpdateTask = async (id: string, updates: any) => {
    // Optimistic update
    const previousTasks = [...tasks]
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
    
    // Show success toast for completion
    if (updates.completed !== undefined) {
      toast.success(updates.completed ? 'Task completed! 🎉' : 'Task marked as incomplete', { duration: 2000 })
    }

    try {
      const res = await fetch(`${serverUrl}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(updates)
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        // Revert on error
        setTasks(previousTasks)
        toast.error(data.error || 'Failed to update task')
        throw new Error(data.error || 'Failed to update task')
      }

      // Refresh data in background
      fetchData(true)
    } catch (error) {
      console.log('Update task error:', error)
      throw error
    }
  }

  const handleDeleteTask = async (id: string) => {
    // Optimistic update
    const previousTasks = [...tasks]
    setTasks(prev => prev.filter(t => t.id !== id))
    toast.success('Task deleted', { duration: 2000 })

    try {
      const res = await fetch(`${serverUrl}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        // Revert on error
        setTasks(previousTasks)
        toast.error(data.error || 'Failed to delete task')
        throw new Error(data.error || 'Failed to delete task')
      }

      // Refresh data in background
      fetchData(true)
    } catch (error) {
      console.log('Delete task error:', error)
      throw error
    }
  }

  const handleSessionComplete = async (taskId: string, duration: number) => {
    // Optimistic update for session
    const optimisticSession = {
      id: `temp-${Date.now()}`,
      taskId,
      duration,
      completedAt: new Date().toISOString()
    }
    setSessions(prev => [...prev, optimisticSession])
    toast.success(`Study session completed! ${Math.round(duration / 60 * 10) / 10}h added`, { duration: 3000 })

    try {
      const res = await fetch(`${serverUrl}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ taskId, duration })
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        // Revert on error
        setSessions(prev => prev.filter(s => s.id !== optimisticSession.id))
        toast.error(data.error || 'Failed to save session')
        throw new Error(data.error || 'Failed to save session')
      }

      // Replace temp session with real one and refresh data
      setSessions(prev => prev.map(s => s.id === optimisticSession.id ? data.session : s))
      fetchData(true)
    } catch (error) {
      console.log('Session complete error:', error)
      throw error
    }
  }

  const handleGenerateSchedule = async (hoursPerDay: number) => {
    try {
      const res = await fetch(`${serverUrl}/generate-schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ availableHoursPerDay: hoursPerDay })
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate schedule')
      }

      return data
    } catch (error) {
      console.log('Generate schedule error:', error)
      throw error
    }
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'timer', label: 'Focus Timer', icon: Timer },
    { id: 'scheduler', label: 'Scheduler', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!accessToken) {
    return authView === 'login' ? (
      <LoginPage
        onLogin={handleLogin}
        onSwitchToSignup={() => {
          setAuthError('')
          setAuthView('signup')
        }}
        error={authError}
        onClearError={() => setAuthError('')}
      />
    ) : (
      <SignupPage
        onSignup={handleSignup}
        onSwitchToLogin={() => {
          setAuthError('')
          setAuthView('login')
        }}
        error={authError}
        onClearError={() => setAuthError('')}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-right" richColors />
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-300 to-pink-300 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900 dark:text-white text-lg">Study Planner</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map(item => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={mainView === item.id ? 'default' : 'ghost'}
                    onClick={() => setMainView(item.id as MainView)}
                    className={mainView === item.id ? 'bg-gradient-to-r from-purple-300 to-pink-300 text-white' : 'dark:text-gray-300 dark:hover:bg-gray-700'}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                )
              })}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden dark:text-gray-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden"
            >
              <div className="px-4 py-2 space-y-1">
                {navItems.map(item => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setMainView(item.id as MainView)
                        setMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        mainView === item.id
                          ? 'bg-gradient-to-r from-purple-300 to-pink-300 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  )
                })}
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={mainView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {mainView === 'dashboard' && analytics && (
              <Dashboard
                userName={userName}
                analytics={analytics}
                upcomingTasks={upcomingTasks}
              />
            )}
            {mainView === 'tasks' && (
              <TaskManager
                tasks={tasks}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            )}
            {mainView === 'timer' && (
              <FocusTimer
                tasks={tasks}
                onSessionComplete={handleSessionComplete}
              />
            )}
            {mainView === 'scheduler' && (
              <StudyScheduler onGenerateSchedule={handleGenerateSchedule} />
            )}
            {mainView === 'analytics' && analytics && (
              <Analytics analytics={analytics} sessions={sessions} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
