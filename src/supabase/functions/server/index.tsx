import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', cors())
app.use('*', logger(console.log))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// Create demo account on server startup
async function createDemoAccount() {
  const demoEmail = 'demo@studyplanner.com'
  const demoPassword = 'Demo123!'
  const demoName = 'Demo Student'
  
  try {
    // Check if demo account already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const demoExists = existingUsers?.users?.some(user => user.email === demoEmail)
    
    if (!demoExists) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: demoEmail,
        password: demoPassword,
        user_metadata: { name: demoName },
        email_confirm: true
      })
      
      if (error) {
        console.log(`Demo account creation error: ${error.message}`)
      } else {
        console.log(`✅ Demo account created: ${demoEmail}`)
        
        // Add some sample data for the demo account
        const userId = data.user.id
        const tasksKey = `user:${userId}:tasks`
        const sessionsKey = `user:${userId}:sessions`
        
        const sampleTasks = [
          {
            id: '1',
            title: 'Mathematics - Calculus',
            subject: 'Mathematics',
            totalPages: 50,
            pagesCompleted: 20,
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Physics - Mechanics',
            subject: 'Physics',
            totalPages: 30,
            pagesCompleted: 5,
            deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString()
          }
        ]
        
        const sampleSessions = [
          {
            id: '1',
            taskId: '1',
            duration: 25,
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '2',
            taskId: '1',
            duration: 25,
            completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
        
        await kv.set(tasksKey, sampleTasks)
        await kv.set(sessionsKey, sampleSessions)
        console.log(`✅ Demo data created for demo account`)
      }
    } else {
      console.log(`ℹ️  Demo account already exists: ${demoEmail}`)
    }
  } catch (error) {
    console.log(`Demo account setup error: ${error}`)
  }
}

// Initialize demo account
createDemoAccount().catch(console.error)

// Helper function to verify user
async function verifyUser(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1]
  if (!accessToken) {
    return { error: 'No access token provided', userId: null }
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken)
  if (error || !user) {
    return { error: 'Unauthorized', userId: null }
  }
  
  return { error: null, userId: user.id }
}

// Health check endpoint
app.get('/make-server-62ce5e0f/health', async (c) => {
  try {
    const demoEmail = 'demo@studyplanner.com'
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const demoExists = existingUsers?.users?.some(user => user.email === demoEmail)
    
    return c.json({
      status: 'ok',
      demoAccountExists: demoExists,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return c.json({
      status: 'error',
      error: String(error),
      timestamp: new Date().toISOString()
    }, 500)
  }
})

// Ensure demo account exists - can be called anytime
app.post('/make-server-62ce5e0f/ensure-demo-account', async (c) => {
  try {
    const demoEmail = 'demo@studyplanner.com'
    const demoPassword = 'Demo123!'
    const demoName = 'Demo Student'
    
    // Check if demo account already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const demoExists = existingUsers?.users?.some(user => user.email === demoEmail)
    
    if (!demoExists) {
      console.log('Creating demo account...')
      const { data, error } = await supabase.auth.admin.createUser({
        email: demoEmail,
        password: demoPassword,
        user_metadata: { name: demoName },
        email_confirm: true
      })
      
      if (error) {
        console.log(`Demo account creation error: ${error.message}`)
        return c.json({ error: error.message, created: false }, 500)
      }
      
      console.log(`✅ Demo account created: ${demoEmail}`)
      
      // Add some sample data for the demo account
      const userId = data.user.id
      const tasksKey = `user:${userId}:tasks`
      const sessionsKey = `user:${userId}:sessions`
      
      const sampleTasks = [
        {
          id: '1',
          title: 'Mathematics - Calculus',
          subject: 'Mathematics',
          totalPages: 50,
          pagesCompleted: 20,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Physics - Mechanics',
          subject: 'Physics',
          totalPages: 30,
          pagesCompleted: 5,
          deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString()
        }
      ]
      
      const sampleSessions = [
        {
          id: '1',
          taskId: '1',
          duration: 25,
          completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          taskId: '1',
          duration: 25,
          completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
      
      await kv.set(tasksKey, sampleTasks)
      await kv.set(sessionsKey, sampleSessions)
      console.log(`✅ Demo data created`)
      
      return c.json({ message: 'Demo account created', created: true })
    } else {
      console.log(`ℹ️  Demo account already exists`)
      return c.json({ message: 'Demo account already exists', created: false })
    }
  } catch (error) {
    console.log(`Ensure demo account error: ${error}`)
    return c.json({ error: String(error), created: false }, 500)
  }
})

// Sign up route
app.post('/make-server-62ce5e0f/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json()
    
    console.log(`📝 Sign up attempt for email: ${email}`)
    
    // Validate password
    if (!password || password.length < 6) {
      console.log(`❌ Password validation failed for: ${email}`)
      return c.json({ error: 'Password must be at least 6 characters long' }, 400)
    }
    
    // Check if user already exists before attempting to create
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const userExists = existingUsers?.users?.some(user => user.email?.toLowerCase() === email.toLowerCase())
    
    if (userExists) {
      console.log(`❌ User already exists: ${email}`)
      return c.json({ error: 'This email is already registered. Please login instead.' }, 409)
    }
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })
    
    if (error) {
      console.log(`❌ Supabase sign up error for ${email}: ${error.message}`)
      // Check if user already exists (backup check)
      const errorMsg = error.message.toLowerCase()
      if (errorMsg.includes('already registered') || 
          errorMsg.includes('already exists') ||
          errorMsg.includes('already been registered') ||
          errorMsg.includes('duplicate') ||
          errorMsg.includes('user already exists')) {
        return c.json({ error: 'This email is already registered. Please login instead.' }, 409)
      }
      return c.json({ error: error.message }, 400)
    }
    
    console.log(`✅ User created successfully: ${email}`)
    return c.json({ user: data.user })
  } catch (error) {
    console.log(`❌ Sign up error during request processing: ${error}`)
    return c.json({ error: 'Failed to sign up. Please try again.' }, 500)
  }
})

// Add task route
app.post('/make-server-62ce5e0f/tasks', async (c) => {
  try {
    const { error: authError, userId } = await verifyUser(c.req.raw)
    if (authError || !userId) {
      return c.json({ error: authError || 'Unauthorized' }, 401)
    }
    
    const { title, subject, estimatedHours, deadline, priority } = await c.req.json()
    
    // Get existing tasks
    const tasksKey = `tasks:${userId}`
    const existingTasks = await kv.get(tasksKey) || []
    
    const newTask = {
      id: crypto.randomUUID(),
      title,
      subject,
      estimatedHours: Number(estimatedHours),
      deadline,
      priority,
      completed: false,
      createdAt: new Date().toISOString()
    }
    
    const updatedTasks = [...existingTasks, newTask]
    await kv.set(tasksKey, updatedTasks)
    
    return c.json({ task: newTask })
  } catch (error) {
    console.log(`Add task error: ${error}`)
    return c.json({ error: 'Failed to add task' }, 500)
  }
})

// Get all tasks
app.get('/make-server-62ce5e0f/tasks', async (c) => {
  try {
    const { error: authError, userId } = await verifyUser(c.req.raw)
    if (authError || !userId) {
      return c.json({ error: authError || 'Unauthorized' }, 401)
    }
    
    const tasksKey = `tasks:${userId}`
    const tasks = await kv.get(tasksKey) || []
    
    return c.json({ tasks })
  } catch (error) {
    console.log(`Get tasks error: ${error}`)
    return c.json({ error: 'Failed to get tasks' }, 500)
  }
})

// Update task
app.put('/make-server-62ce5e0f/tasks/:id', async (c) => {
  try {
    const { error: authError, userId } = await verifyUser(c.req.raw)
    if (authError || !userId) {
      return c.json({ error: authError || 'Unauthorized' }, 401)
    }
    
    const taskId = c.req.param('id')
    const updates = await c.req.json()
    
    const tasksKey = `tasks:${userId}`
    const tasks = await kv.get(tasksKey) || []
    
    const taskIndex = tasks.findIndex((t: any) => t.id === taskId)
    if (taskIndex === -1) {
      return c.json({ error: 'Task not found' }, 404)
    }
    
    tasks[taskIndex] = { ...tasks[taskIndex], ...updates }
    await kv.set(tasksKey, tasks)
    
    return c.json({ task: tasks[taskIndex] })
  } catch (error) {
    console.log(`Update task error: ${error}`)
    return c.json({ error: 'Failed to update task' }, 500)
  }
})

// Delete task
app.delete('/make-server-62ce5e0f/tasks/:id', async (c) => {
  try {
    const { error: authError, userId } = await verifyUser(c.req.raw)
    if (authError || !userId) {
      return c.json({ error: authError || 'Unauthorized' }, 401)
    }
    
    const taskId = c.req.param('id')
    
    const tasksKey = `tasks:${userId}`
    const tasks = await kv.get(tasksKey) || []
    
    const filteredTasks = tasks.filter((t: any) => t.id !== taskId)
    await kv.set(tasksKey, filteredTasks)
    
    return c.json({ success: true })
  } catch (error) {
    console.log(`Delete task error: ${error}`)
    return c.json({ error: 'Failed to delete task' }, 500)
  }
})

// Add study session
app.post('/make-server-62ce5e0f/sessions', async (c) => {
  try {
    const { error: authError, userId } = await verifyUser(c.req.raw)
    if (authError || !userId) {
      return c.json({ error: authError || 'Unauthorized' }, 401)
    }
    
    const { taskId, duration, completedAt } = await c.req.json()
    
    const sessionsKey = `sessions:${userId}`
    const existingSessions = await kv.get(sessionsKey) || []
    
    const newSession = {
      id: crypto.randomUUID(),
      taskId,
      duration: Number(duration),
      completedAt: completedAt || new Date().toISOString()
    }
    
    const updatedSessions = [...existingSessions, newSession]
    await kv.set(sessionsKey, updatedSessions)
    
    return c.json({ session: newSession })
  } catch (error) {
    console.log(`Add session error: ${error}`)
    return c.json({ error: 'Failed to add session' }, 500)
  }
})

// Get sessions
app.get('/make-server-62ce5e0f/sessions', async (c) => {
  try {
    const { error: authError, userId } = await verifyUser(c.req.raw)
    if (authError || !userId) {
      return c.json({ error: authError || 'Unauthorized' }, 401)
    }
    
    const sessionsKey = `sessions:${userId}`
    const sessions = await kv.get(sessionsKey) || []
    
    return c.json({ sessions })
  } catch (error) {
    console.log(`Get sessions error: ${error}`)
    return c.json({ error: 'Failed to get sessions' }, 500)
  }
})

// Get analytics
app.get('/make-server-62ce5e0f/analytics', async (c) => {
  try {
    const { error: authError, userId } = await verifyUser(c.req.raw)
    if (authError || !userId) {
      return c.json({ error: authError || 'Unauthorized' }, 401)
    }
    
    const tasksKey = `tasks:${userId}`
    const sessionsKey = `sessions:${userId}`
    
    const tasks = await kv.get(tasksKey) || []
    const sessions = await kv.get(sessionsKey) || []
    
    // Calculate analytics
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((t: any) => t.completed).length
    const pendingTasks = totalTasks - completedTasks
    
    // Calculate total study time
    const totalMinutes = sessions.reduce((sum: number, s: any) => sum + s.duration, 0)
    const totalHours = Math.round(totalMinutes / 60 * 10) / 10
    
    // Calculate this week's study time
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const thisWeekSessions = sessions.filter((s: any) => 
      new Date(s.completedAt) >= oneWeekAgo
    )
    const weekMinutes = thisWeekSessions.reduce((sum: number, s: any) => sum + s.duration, 0)
    const weekHours = Math.round(weekMinutes / 60 * 10) / 10
    
    // Study by subject
    const studyBySubject: Record<string, number> = {}
    sessions.forEach((session: any) => {
      const task = tasks.find((t: any) => t.id === session.taskId)
      if (task) {
        const subject = task.subject || 'Other'
        studyBySubject[subject] = (studyBySubject[subject] || 0) + session.duration
      }
    })
    
    // Generate insight
    let insight = ''
    if (weekHours >= 10) {
      insight = `Amazing! You've studied ${weekHours} hours this week. You're crushing it! 🔥`
    } else if (weekHours >= 5) {
      insight = `Great work! You've studied ${weekHours} hours this week. Keep it up! 📚`
    } else if (weekHours > 0) {
      insight = `You've studied ${weekHours} hours this week. Let's aim for more! 💪`
    } else {
      insight = "No study sessions this week. Time to get started! 🚀"
    }
    
    return c.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      totalHours,
      weekHours,
      studyBySubject,
      insight
    })
  } catch (error) {
    console.log(`Get analytics error: ${error}`)
    return c.json({ error: 'Failed to get analytics' }, 500)
  }
})

// Helper to calculate analytics from tasks and sessions
function calculateAnalytics(tasks: any[], sessions: any[]) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t: any) => t.completed).length
  const pendingTasks = totalTasks - completedTasks
  
  // Calculate total study time
  const totalMinutes = sessions.reduce((sum: number, s: any) => sum + s.duration, 0)
  const totalHours = Math.round(totalMinutes / 60 * 10) / 10
  
  // Calculate this week's study time
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
  const thisWeekSessions = sessions.filter((s: any) => 
    new Date(s.completedAt) >= oneWeekAgo
  )
  const weekMinutes = thisWeekSessions.reduce((sum: number, s: any) => sum + s.duration, 0)
  const weekHours = Math.round(weekMinutes / 60 * 10) / 10
  
  // Study by subject
  const studyBySubject: Record<string, number> = {}
  sessions.forEach((session: any) => {
    const task = tasks.find((t: any) => t.id === session.taskId)
    if (task) {
      const subject = task.subject || 'Other'
      studyBySubject[subject] = (studyBySubject[subject] || 0) + session.duration
    }
  })
  
  // Generate insight
  let insight = ''
  if (weekHours >= 10) {
    insight = `Amazing! You've studied ${weekHours} hours this week. You're crushing it! 🔥`
  } else if (weekHours >= 5) {
    insight = `Great work! You've studied ${weekHours} hours this week. Keep it up! 📚`
  } else if (weekHours > 0) {
    insight = `You've studied ${weekHours} hours this week. Let's aim for more! 💪`
  } else {
    insight = "No study sessions this week. Time to get started! 🚀"
  }
  
  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    totalHours,
    weekHours,
    studyBySubject,
    insight
  }
}

// Batched endpoint to get all data in one call for better performance
app.get('/make-server-62ce5e0f/all-data', async (c) => {
  try {
    const { error: authError, userId } = await verifyUser(c.req.raw)
    if (authError || !userId) {
      return c.json({ error: authError || 'Unauthorized' }, 401)
    }
    
    const tasksKey = `tasks:${userId}`
    const sessionsKey = `sessions:${userId}`
    
    // Fetch both in parallel for maximum speed
    const [tasks, sessions] = await Promise.all([
      kv.get(tasksKey),
      kv.get(sessionsKey)
    ])
    
    const validTasks = tasks || []
    const validSessions = sessions || []
    
    // Calculate analytics
    const analytics = calculateAnalytics(validTasks, validSessions)
    
    return c.json({
      tasks: validTasks,
      sessions: validSessions,
      analytics
    })
  } catch (error) {
    console.log(`Get all data error: ${error}`)
    return c.json({ error: 'Failed to get data' }, 500)
  }
})

// Generate study schedule
app.post('/make-server-62ce5e0f/generate-schedule', async (c) => {
  try {
    const { error: authError, userId } = await verifyUser(c.req.raw)
    if (authError || !userId) {
      return c.json({ error: authError || 'Unauthorized' }, 401)
    }
    
    const { availableHoursPerDay } = await c.req.json()
    
    const tasksKey = `tasks:${userId}`
    const tasks = await kv.get(tasksKey) || []
    
    // Filter incomplete tasks and sort by deadline and priority
    const incompleteTasks = tasks.filter((t: any) => !t.completed)
    
    if (incompleteTasks.length === 0) {
      return c.json({ 
        schedule: [], 
        message: "All tasks completed! Great job! 🎉" 
      })
    }
    
    // Sort tasks by deadline (earliest first) and priority (high first)
    const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 }
    incompleteTasks.sort((a: any, b: any) => {
      const dateA = new Date(a.deadline).getTime()
      const dateB = new Date(b.deadline).getTime()
      if (dateA !== dateB) return dateA - dateB
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
    })
    
    // Generate schedule
    const schedule = []
    let currentDay = 0
    let remainingHoursToday = Number(availableHoursPerDay) || 2
    
    for (const task of incompleteTasks) {
      let remainingTaskHours = task.estimatedHours
      
      while (remainingTaskHours > 0) {
        const hoursForThisSession = Math.min(remainingTaskHours, remainingHoursToday)
        
        const sessionDate = new Date()
        sessionDate.setDate(sessionDate.getDate() + currentDay)
        
        schedule.push({
          taskId: task.id,
          taskTitle: task.title,
          subject: task.subject,
          hours: hoursForThisSession,
          date: sessionDate.toISOString().split('T')[0],
          dayLabel: currentDay === 0 ? 'Today' : currentDay === 1 ? 'Tomorrow' : `Day ${currentDay + 1}`
        })
        
        remainingTaskHours -= hoursForThisSession
        remainingHoursToday -= hoursForThisSession
        
        if (remainingHoursToday <= 0) {
          currentDay++
          remainingHoursToday = Number(availableHoursPerDay) || 2
        }
      }
    }
    
    return c.json({ schedule })
  } catch (error) {
    console.log(`Generate schedule error: ${error}`)
    return c.json({ error: 'Failed to generate schedule' }, 500)
  }
})

// Helper endpoint to check if user exists (for debugging)
app.post('/make-server-62ce5e0f/check-user', async (c) => {
  try {
    const { email } = await c.req.json()
    
    if (!email) {
      return c.json({ error: 'Email is required' }, 400)
    }
    
    console.log(`🔍 Checking if user exists: ${email}`)
    
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const user = existingUsers?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase())
    
    if (user) {
      console.log(`✅ User found: ${email}`)
      console.log(`User ID: ${user.id}`)
      console.log(`Email confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`)
      console.log(`Created at: ${user.created_at}`)
      console.log(`User metadata:`, user.user_metadata)
      
      return c.json({ 
        exists: true,
        userId: user.id,
        email: user.email,
        emailConfirmed: !!user.email_confirmed_at,
        createdAt: user.created_at,
        metadata: user.user_metadata
      })
    } else {
      console.log(`❌ User not found: ${email}`)
      return c.json({ exists: false })
    }
  } catch (error) {
    console.log(`Check user error: ${error}`)
    return c.json({ error: 'Failed to check user' }, 500)
  }
})

Deno.serve(app.fetch)
