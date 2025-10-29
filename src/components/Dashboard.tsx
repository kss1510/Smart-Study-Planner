import React from 'react'
import { motion } from 'motion/react'
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Calendar,
  Target
} from 'lucide-react'
import { Card } from './ui/card'

interface DashboardProps {
  userName: string
  analytics: {
    totalTasks: number
    completedTasks: number
    pendingTasks: number
    totalHours: number
    weekHours: number
    studyBySubject: Record<string, number>
    insight: string
  }
  upcomingTasks: any[]
}

export const Dashboard = React.memo(function Dashboard({ userName, analytics, upcomingTasks }: DashboardProps) {
  const completionRate = analytics.totalTasks > 0 
    ? Math.round((analytics.completedTasks / analytics.totalTasks) * 100) 
    : 0

  const statsCards = React.useMemo(() => [
    {
      title: 'Total Tasks',
      value: analytics.totalTasks,
      icon: Target,
      gradient: 'from-blue-300 to-cyan-300',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Completed',
      value: analytics.completedTasks,
      icon: CheckCircle,
      gradient: 'from-green-300 to-emerald-300',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Study Hours',
      value: `${analytics.weekHours}h`,
      icon: Clock,
      gradient: 'from-purple-300 to-pink-300',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Completion',
      value: `${completionRate}%`,
      icon: TrendingUp,
      gradient: 'from-orange-300 to-rose-300',
      bgColor: 'bg-orange-50'
    }
  ], [analytics, completionRate])

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-300 to-pink-300 rounded-3xl p-8 text-white shadow-lg">
        <h1 className="text-white mb-2">Welcome back, {userName}! 👋</h1>
        <p className="text-purple-50">
          {analytics.insight}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="relative overflow-hidden group bg-white dark:bg-gray-800 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                {/* Gradient background that appears on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <motion.div 
                      className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-3xl text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Upcoming Tasks & Study by Subject */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card className="p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-purple-400 dark:text-purple-300" />
            <h3 className="text-gray-900 dark:text-white">Upcoming Tasks</h3>
          </div>
          <div className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No upcoming tasks. Add some to get started!</p>
            ) : (
              upcomingTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
                >
                  <div className="flex-1">
                    <div className="text-gray-900 dark:text-white">{task.title}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">{task.subject}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm px-2 py-1 rounded-lg ${
                      task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                      'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    }`}>
                      {task.priority}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      {new Date(task.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Study by Subject */}
        <Card className="p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-400 dark:text-blue-300" />
            <h3 className="text-gray-900 dark:text-white">Study Time by Subject</h3>
          </div>
          <div className="space-y-3">
            {Object.keys(analytics.studyBySubject).length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No study sessions yet. Start a focus session!</p>
            ) : (
              Object.entries(analytics.studyBySubject).map(([subject, minutes]) => {
                const hours = Math.round(minutes / 60 * 10) / 10
                const maxMinutes = Math.max(...Object.values(analytics.studyBySubject))
                const percentage = (minutes / maxMinutes) * 100
                
                return (
                  <div
                    key={subject}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 dark:text-white">{subject}</span>
                      <span className="text-gray-600 dark:text-gray-400">{hours}h</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-blue-300 to-purple-300 rounded-full"
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  )
})
