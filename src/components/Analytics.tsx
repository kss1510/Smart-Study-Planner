import React, { useMemo } from 'react'
import { motion } from 'motion/react'
import { TrendingUp, Target, Clock, Award, Calendar, BookOpen } from 'lucide-react'
import { Card } from './ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface AnalyticsProps {
  analytics: {
    totalTasks: number
    completedTasks: number
    pendingTasks: number
    totalHours: number
    weekHours: number
    studyBySubject: Record<string, number>
    insight: string
  }
  sessions: any[]
}

export const Analytics = React.memo(function Analytics({ analytics, sessions }: AnalyticsProps) {
  // Prepare data for subject chart - memoized for performance
  const subjectData = useMemo(() => 
    Object.entries(analytics.studyBySubject).map(([subject, minutes]) => ({
      subject,
      hours: Math.round(minutes / 60 * 10) / 10
    })).sort((a, b) => b.hours - a.hours),
    [analytics.studyBySubject]
  )

  // Prepare data for daily activity (last 7 days) - memoized for performance
  const dailyData = useMemo(() => {
    const data = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const daySessions = sessions.filter(s => 
        s.completedAt.startsWith(dateStr)
      )
      
      const totalMinutes = daySessions.reduce((sum, s) => sum + s.duration, 0)
      
      data.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        hours: Math.round(totalMinutes / 60 * 10) / 10
      })
    }
    return data
  }, [sessions])

  const completionRate = useMemo(() => 
    analytics.totalTasks > 0 
      ? Math.round((analytics.completedTasks / analytics.totalTasks) * 100) 
      : 0,
    [analytics.totalTasks, analytics.completedTasks]
  )

  const COLORS = ['#c4b5fd', '#f9a8d4', '#93c5fd', '#86efac', '#fcd34d', '#fca5a5']

  const statsCards = useMemo(() => [
    {
      title: 'Total Study Time',
      value: `${analytics.totalHours}h`,
      change: '+12% from last week',
      icon: Clock,
      color: 'purple',
      gradient: 'from-purple-300 to-pink-300'
    },
    {
      title: 'This Week',
      value: `${analytics.weekHours}h`,
      change: 'Keep up the momentum!',
      icon: Calendar,
      color: 'blue',
      gradient: 'from-blue-300 to-cyan-300'
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      change: `${analytics.completedTasks}/${analytics.totalTasks} tasks done`,
      icon: Target,
      color: 'green',
      gradient: 'from-green-300 to-emerald-300'
    },
    {
      title: 'Study Sessions',
      value: sessions.length,
      change: 'Total Pomodoro sessions',
      icon: Award,
      color: 'orange',
      gradient: 'from-orange-300 to-rose-300'
    }
  ], [analytics, completionRate, sessions.length])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 dark:text-white">Analytics & Insights</h2>
        <p className="text-gray-600 dark:text-gray-400">Track your study progress and performance</p>
      </div>

      {/* Insight Banner */}
      <Card className="p-6 bg-gradient-to-r from-purple-300 to-pink-300 text-white">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-6 h-6 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-white mb-1">Weekly Insight</h3>
            <p className="text-purple-50">{analytics.insight}</p>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="relative overflow-hidden group dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative p-6">
                  <motion.div 
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.gradient} mb-4 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</div>
                  <div className="text-3xl text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{stat.change}</div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity Chart */}
        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-gray-900 dark:text-white mb-4">Daily Study Activity</h3>
            {dailyData.some(d => d.hours > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-700" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    formatter={(value: any) => [`${value}h`, 'Study Time']}
                  />
                  <Bar 
                    dataKey="hours" 
                    fill="url(#colorGradient)" 
                    radius={[8, 8, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c4b5fd" />
                      <stop offset="100%" stopColor="#f9a8d4" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p>No study sessions recorded yet</p>
                </div>
              </div>
            )}
        </Card>

        {/* Study by Subject Chart */}
        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-gray-900 dark:text-white mb-4">Study Time by Subject</h3>
            {subjectData.length > 0 ? (
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={subjectData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ subject, percent }) => `${subject} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="hours"
                    >
                      {subjectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      formatter={(value: any) => [`${value}h`, 'Study Time']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p>No subject data available yet</p>
                </div>
              </div>
            )}
        </Card>
      </div>

      {/* Study Streaks & Achievements */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-gray-900 dark:text-white mb-4">Achievements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-gray-900 dark:text-white">Week Champion</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Studied {analytics.weekHours}h this week</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
            <div className="text-4xl mb-2">📚</div>
            <div className="text-gray-900 dark:text-white">Task Master</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Completed {analytics.completedTasks} tasks</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-gray-900 dark:text-white">Focus Expert</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">{sessions.length} Pomodoro sessions</div>
          </div>
        </div>
      </Card>
    </div>
  )
})
