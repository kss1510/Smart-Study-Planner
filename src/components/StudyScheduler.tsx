import { useState } from 'react'
import { motion } from 'motion/react'
import { Calendar, Clock, BookOpen, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card } from './ui/card'

interface ScheduleSession {
  taskId: string
  taskTitle: string
  subject: string
  hours: number
  date: string
  dayLabel: string
}

interface StudySchedulerProps {
  onGenerateSchedule: (hoursPerDay: number) => Promise<{ schedule: ScheduleSession[], message?: string }>
}

export function StudyScheduler({ onGenerateSchedule }: StudySchedulerProps) {
  const [hoursPerDay, setHoursPerDay] = useState('2')
  const [schedule, setSchedule] = useState<ScheduleSession[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const result = await onGenerateSchedule(Number(hoursPerDay))
      setSchedule(result.schedule)
      setMessage(result.message || '')
    } finally {
      setLoading(false)
    }
  }

  // Group schedule by date
  const groupedSchedule = schedule.reduce((acc, session) => {
    if (!acc[session.date]) {
      acc[session.date] = {
        dayLabel: session.dayLabel,
        sessions: []
      }
    }
    acc[session.date].sessions.push(session)
    return acc
  }, {} as Record<string, { dayLabel: string, sessions: ScheduleSession[] }>)

  const sortedDates = Object.keys(groupedSchedule).sort()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 dark:text-white">Smart Scheduler</h2>
        <p className="text-gray-600 dark:text-gray-400">Generate an optimized study plan based on your tasks</p>
      </div>

      {/* Input Section */}
      <Card className="p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-md">
          <h3 className="text-gray-900 dark:text-white mb-4">Schedule Preferences</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hours">Available Study Hours Per Day</Label>
              <div className="flex gap-2">
                <Input
                  id="hours"
                  type="number"
                  min="0.5"
                  max="12"
                  step="0.5"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-300 to-pink-300 hover:from-purple-400 hover:to-pink-400 text-white"
                >
                  {loading ? (
                    'Generating...'
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                We'll create a balanced schedule based on your task deadlines and priorities
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 dark:bg-opacity-20 border-green-200 dark:border-green-800">
            <p className="text-green-700 dark:text-green-300">{message}</p>
          </Card>
        </motion.div>
      )}

      {/* Schedule Display */}
      {schedule.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-gray-900 dark:text-white">Your Study Schedule</h3>
          
          {sortedDates.map((date, dateIndex) => {
            const day = groupedSchedule[date]
            const totalHours = day.sessions.reduce((sum, s) => sum + s.hours, 0)
            
            return (
              <motion.div
                key={date}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: dateIndex * 0.1 }}
              >
                <Card className="overflow-hidden bg-white dark:bg-gray-800 dark:border-gray-700">
                  {/* Day Header */}
                  <div className="bg-gradient-to-r from-purple-300 to-pink-300 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5" />
                        <div>
                          <div>{day.dayLabel}</div>
                          <div className="text-purple-100 text-sm">
                            {new Date(date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
                        <Clock className="w-4 h-4" />
                        <span>{totalHours}h total</span>
                      </div>
                    </div>
                  </div>

                  {/* Sessions */}
                  <div className="p-4 space-y-3">
                    {day.sessions.map((session, sessionIndex) => (
                      <motion.div
                        key={`${session.taskId}-${sessionIndex}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: dateIndex * 0.1 + sessionIndex * 0.05 }}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="text-gray-900">{session.taskTitle}</div>
                          <div className="text-gray-600 text-sm">{session.subject}</div>
                        </div>
                        <div className="flex items-center gap-2 text-purple-400 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-300 rounded-lg px-3 py-1">
                          <Clock className="w-4 h-4" />
                          <span>{session.hours}h</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )
          })}

          {/* Summary */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <h4 className="text-gray-900 mb-2">📊 Schedule Summary</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Total Days</div>
                <div className="text-gray-900">{sortedDates.length}</div>
              </div>
              <div>
                <div className="text-gray-600">Total Sessions</div>
                <div className="text-gray-900">{schedule.length}</div>
              </div>
              <div>
                <div className="text-gray-600">Total Hours</div>
                <div className="text-gray-900">
                  {schedule.reduce((sum, s) => sum + s.hours, 0)}h
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {schedule.length === 0 && !message && (
        <Card className="p-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No Schedule Yet</h3>
            <p className="text-gray-600 mb-4">
              Set your available hours and click "Generate" to create your personalized study schedule
            </p>
          </motion.div>
        </Card>
      )}
    </div>
  )
}
