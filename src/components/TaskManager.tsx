import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X,
  Calendar,
  BookOpen,
  Clock
} from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card } from './ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

interface Task {
  id: string
  title: string
  subject: string
  estimatedHours: number
  deadline: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  createdAt: string
}

interface TaskManagerProps {
  tasks: Task[]
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => Promise<void>
  onUpdateTask: (id: string, updates: Partial<Task>) => Promise<void>
  onDeleteTask: (id: string) => Promise<void>
}

export function TaskManager({ tasks, onAddTask, onUpdateTask, onDeleteTask }: TaskManagerProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    estimatedHours: '2',
    deadline: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Close dialog immediately for faster perceived performance
    setShowAddDialog(false)
    
    try {
      if (editingTask) {
        await onUpdateTask(editingTask.id, {
          title: formData.title,
          subject: formData.subject,
          estimatedHours: Number(formData.estimatedHours),
          deadline: formData.deadline,
          priority: formData.priority
        })
        setEditingTask(null)
      } else {
        await onAddTask({
          title: formData.title,
          subject: formData.subject,
          estimatedHours: Number(formData.estimatedHours),
          deadline: formData.deadline,
          priority: formData.priority
        })
      }
      
      setFormData({
        title: '',
        subject: '',
        estimatedHours: '2',
        deadline: '',
        priority: 'medium'
      })
    } catch (error) {
      // Dialog already closed, just log error
      console.error('Task submit error:', error)
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      subject: task.subject,
      estimatedHours: task.estimatedHours.toString(),
      deadline: task.deadline,
      priority: task.priority
    })
    setShowAddDialog(true)
  }

  const handleToggleComplete = async (task: Task) => {
    await onUpdateTask(task.id, { completed: !task.completed })
  }

  const pendingTasks = useMemo(() => tasks.filter(t => !t.completed), [tasks])
  const completedTasks = useMemo(() => tasks.filter(t => t.completed), [tasks])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-white">My Tasks</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your study tasks and assignments</p>
        </div>
        <Button
          onClick={() => {
            setEditingTask(null)
            setFormData({
              title: '',
              subject: '',
              estimatedHours: '2',
              deadline: '',
              priority: 'medium'
            })
            setShowAddDialog(true)
          }}
          className="bg-gradient-to-r from-purple-300 to-pink-300 hover:from-purple-400 hover:to-pink-400 text-white"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Pending Tasks */}
      <div>
        <h3 className="text-gray-900 dark:text-white mb-4">Pending ({pendingTasks.length})</h3>
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {pendingTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="p-8 text-center bg-white dark:bg-gray-800 dark:border-gray-700">
                  <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No pending tasks. You're all caught up!</p>
                </Card>
              </motion.div>
            ) : (
              pendingTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <Card className="p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => handleToggleComplete(task)}
                        className="mt-1 w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-300 flex items-center justify-center transition-colors"
                      >
                        {task.completed && <Check className="w-4 h-4 text-purple-300" />}
                      </button>
                      
                      <div className="flex-1">
                        <h4 className="text-gray-900 dark:text-white mb-2">{task.title}</h4>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <BookOpen className="w-4 h-4" />
                            {task.subject}
                          </div>
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            {task.estimatedHours}h
                          </div>
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            {new Date(task.deadline).toLocaleDateString()}
                          </div>
                          <div className={`px-2 py-1 rounded-lg ${
                            task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                            'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          }`}>
                            {task.priority} priority
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(task)}
                          className="text-gray-600 dark:text-gray-400 hover:text-purple-400 dark:hover:text-purple-300"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteTask(task.id)}
                          className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-gray-900 dark:text-white mb-4">Completed ({completedTasks.length})</h3>
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {completedTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <Card className="p-4 bg-gray-50 dark:bg-gray-800 opacity-75 dark:border-gray-700">
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => handleToggleComplete(task)}
                        className="mt-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </button>
                      
                      <div className="flex-1">
                        <h4 className="text-gray-600 dark:text-gray-400 line-through">{task.title}</h4>
                        <div className="flex flex-wrap gap-4 text-sm mt-2">
                          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-500">
                            <BookOpen className="w-4 h-4" />
                            {task.subject}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteTask(task.id)}
                        className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Add/Edit Task Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                placeholder="e.g., Study Chapter 3"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g., Mathematics"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Estimated Hours</Label>
              <Input
                id="hours"
                type="number"
                min="0.5"
                step="0.5"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as 'low' | 'medium' | 'high' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-300 to-pink-300 hover:from-purple-400 hover:to-pink-400 text-white"
              >
                {editingTask ? 'Update Task' : 'Add Task'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
