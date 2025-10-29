import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Play, Pause, RotateCcw, Coffee, Brain, CheckCircle, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

interface FocusTimerProps {
  tasks: any[]
  onSessionComplete: (taskId: string, duration: number) => Promise<void>
}

type TimerMode = 'focus' | 'break'

const MOTIVATIONAL_QUOTES = [
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "You are capable of more than you know.", author: "Benjamin Spock" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Study while others are sleeping; work while others are loafing.", author: "William A. Ward" },
  { text: "Your limitation—it's only your imagination.", author: "Unknown" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "Dream bigger. Do bigger.", author: "Unknown" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
  { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
  { text: "Little things make big days.", author: "Unknown" },
]

export function FocusTimer({ tasks, onSessionComplete }: FocusTimerProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string>('')
  const [mode, setMode] = useState<TimerMode>('focus')
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [totalFocusTime, setTotalFocusTime] = useState(0)
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const intervalRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const quoteIntervalRef = useRef<number | null>(null)

  const focusDuration = 25 * 60 // 25 minutes
  const breakDuration = 5 * 60 // 5 minutes

  const incompleteTasks = tasks.filter(t => !t.completed)
  const currentQuote = MOTIVATIONAL_QUOTES[currentQuoteIndex]

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1))
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      handleTimerComplete()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  // Rotate quotes every 30 seconds while running in focus mode
  useEffect(() => {
    if (isRunning && mode === 'focus') {
      quoteIntervalRef.current = window.setInterval(() => {
        setCurrentQuoteIndex(prev => (prev + 1) % MOTIVATIONAL_QUOTES.length)
      }, 30000) // Change quote every 30 seconds
    } else {
      if (quoteIntervalRef.current) {
        clearInterval(quoteIntervalRef.current)
      }
    }

    return () => {
      if (quoteIntervalRef.current) {
        clearInterval(quoteIntervalRef.current)
      }
    }
  }, [isRunning, mode])

  const handleTimerComplete = async () => {
    setIsRunning(false)
    
    if (mode === 'focus') {
      // Save the focus session
      const focusMinutes = focusDuration / 60
      setTotalFocusTime(prev => prev + focusMinutes)
      
      if (selectedTaskId) {
        await onSessionComplete(selectedTaskId, focusMinutes)
      }
      
      // Switch to break mode
      setMode('break')
      setTimeLeft(breakDuration)
    } else {
      // Break complete, switch back to focus
      setMode('focus')
      setTimeLeft(focusDuration)
    }
  }

  const handleStart = () => {
    if (!isRunning) {
      startTimeRef.current = Date.now()
    }
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(mode === 'focus' ? focusDuration : breakDuration)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = mode === 'focus'
    ? ((focusDuration - timeLeft) / focusDuration) * 100
    : ((breakDuration - timeLeft) / breakDuration) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 dark:text-white">Focus Mode</h2>
        <p className="text-gray-600 dark:text-gray-400">Use the Pomodoro technique to boost productivity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timer Card */}
        <Card className="lg:col-span-2 p-8 bg-white dark:bg-gray-800 dark:border-gray-700">
          <div className="text-center">
            {/* Mode Indicator */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-6"
            >
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                mode === 'focus' 
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700' 
                  : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
              }`}>
                {mode === 'focus' ? (
                  <>
                    <Brain className="w-5 h-5" />
                    <span>Focus Session</span>
                  </>
                ) : (
                  <>
                    <Coffee className="w-5 h-5" />
                    <span>Break Time</span>
                  </>
                )}
              </div>
            </motion.div>

            {/* Timer Display */}
            <div className="relative w-64 h-64 mx-auto mb-8">
              {/* Progress Circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <motion.circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progress / 100 }}
                  style={{
                    strokeDasharray: `${2 * Math.PI * 120}`,
                  }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    {mode === 'focus' ? (
                      <>
                        <stop offset="0%" stopColor="#9333ea" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </>
                    ) : (
                      <>
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </>
                    )}
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Time Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-gray-900 dark:text-white" style={{ fontSize: '3rem', fontWeight: 700 }}>
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            {/* Motivational Quote (shown during focus mode) */}
            {mode === 'focus' && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuoteIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8 px-6"
                >
                  <div className="flex items-start gap-2 text-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-500 dark:text-purple-400 flex-shrink-0 mt-1" />
                    <div className="max-w-md">
                      <p className="text-gray-700 dark:text-gray-300 italic mb-2">
                        "{currentQuote.text}"
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        — {currentQuote.author}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={isRunning ? handlePause : handleStart}
                className={`${
                  mode === 'focus'
                    ? 'bg-gradient-to-r from-purple-300 to-pink-300 hover:from-purple-400 hover:to-pink-400'
                    : 'bg-gradient-to-r from-green-300 to-emerald-300 hover:from-green-400 hover:to-emerald-400'
                } text-white px-8`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleReset}
                className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Settings & Stats Card */}
        <div className="space-y-6">
          <Card className="p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-gray-900 dark:text-white mb-4">Session Settings</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-select">Select Task</Label>
                <Select
                  value={selectedTaskId}
                  onValueChange={setSelectedTaskId}
                  disabled={isRunning}
                >
                  <SelectTrigger id="task-select">
                    <SelectValue placeholder="Choose a task" />
                  </SelectTrigger>
                  <SelectContent>
                    {incompleteTasks.length === 0 ? (
                      <SelectItem value="none" disabled>No tasks available</SelectItem>
                    ) : (
                      incompleteTasks.map(task => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-gray-600 dark:text-gray-400 mb-2">Pomodoro Settings</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Focus Duration:</span>
                    <span className="text-gray-900 dark:text-white">25 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Break Duration:</span>
                    <span className="text-gray-900 dark:text-white">5 minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-gray-900 dark:text-white mb-4">Today's Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 dark:bg-opacity-20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-purple-400 dark:text-purple-300" />
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">Focus Sessions</div>
                  <div className="text-gray-900 dark:text-white">{Math.floor(totalFocusTime / 25)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 dark:bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-blue-400 dark:text-blue-300" />
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">Total Time</div>
                  <div className="text-gray-900 dark:text-white">{totalFocusTime} min</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Tips */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <h4 className="text-gray-900 dark:text-white mb-2">💡 Pomodoro Tips</h4>
        <ul className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
          <li>• Work for 25 minutes with full focus</li>
          <li>• Take a 5-minute break to recharge</li>
          <li>• Eliminate distractions during focus time</li>
          <li>• After 4 sessions, take a longer 15-30 minute break</li>
        </ul>
      </Card>
    </div>
  )
}
