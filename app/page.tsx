'use client'

import { useState, useEffect, useMemo } from 'react'
import TaskForm from '@/components/TaskForm'
import TaskCard from '@/components/TaskCard'
import TaskStatsComponent from '@/components/TaskStats'
import SearchAndFilter from '@/components/SearchAndFilter'
import { Task, TaskTemplate, TaskStats } from '@/types'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<{
    priority?: 'low' | 'medium' | 'high'
    category?: string
    status?: 'active' | 'completed' | 'overdue'
    tags?: string[]
  }>({})
  const [templates] = useState<TaskTemplate[]>([
    {
      id: '1',
      name: 'Website Launch',
      description: 'Complete website development and deployment',
      category: 'Development',
      tags: ['web', 'development', 'launch'],
      workflow: [
        { title: 'Design mockups', order: 0, estimatedTime: 120, priority: 'high' },
        { title: 'Frontend development', order: 1, estimatedTime: 480, priority: 'high' },
        { title: 'Backend API', order: 2, estimatedTime: 360, priority: 'medium' },
        { title: 'Testing & QA', order: 3, estimatedTime: 180, priority: 'medium' },
        { title: 'Deploy to production', order: 4, estimatedTime: 60, priority: 'high' }
      ]
    },
    {
      id: '2', 
      name: 'Content Marketing',
      description: 'Create and publish marketing content',
      category: 'Marketing',
      tags: ['content', 'marketing', 'social'],
      workflow: [
        { title: 'Research topics', order: 0, estimatedTime: 90, priority: 'medium' },
        { title: 'Write blog post', order: 1, estimatedTime: 180, priority: 'high' },
        { title: 'Create social media graphics', order: 2, estimatedTime: 60, priority: 'low' },
        { title: 'Schedule posts', order: 3, estimatedTime: 30, priority: 'medium' },
        { title: 'Monitor engagement', order: 4, estimatedTime: 45, priority: 'low' }
      ]
    }
  ])

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('workflow-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined
      })))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('workflow-tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      createdAt: new Date(),
      tags: taskData.tags || [],
      priority: taskData.priority || 'medium'
    }
    setTasks(prev => [newTask, ...prev])
  }

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  const toggleStep = (taskId: string, stepId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedWorkflow = task.workflow.map(step => 
          step.id === stepId ? { ...step, completed: !step.completed } : step
        )
        
        const allCompleted = updatedWorkflow.every(step => step.completed)
        
        return {
          ...task,
          workflow: updatedWorkflow,
          completedAt: allCompleted && !task.completedAt ? new Date() : 
                      !allCompleted ? undefined : task.completedAt
        }
      }
      return task
    }))
  }

  // Advanced filtering and search
  const filteredTasks = useMemo(() => {
    let filtered = tasks

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Priority filter
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority)
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(task => task.category === filters.category)
    }

    // Status filter
    if (filters.status) {
      if (filters.status === 'active') {
        filtered = filtered.filter(task => !task.completedAt)
      } else if (filters.status === 'completed') {
        filtered = filtered.filter(task => task.completedAt)
      } else if (filters.status === 'overdue') {
        filtered = filtered.filter(task => 
          task.dueDate && new Date() > task.dueDate && !task.completedAt
        )
      }
    }

    return filtered
  }, [tasks, searchQuery, filters])

  const activeTasks = filteredTasks.filter(task => !task.completedAt)
  const completedTasks = filteredTasks.filter(task => task.completedAt)
  
  // Analytics
  const stats: TaskStats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(t => t.completedAt).length
    const active = tasks.filter(t => !t.completedAt).length
    const overdue = tasks.filter(t => t.dueDate && new Date() > t.dueDate && !t.completedAt).length
    
    const completedWithTime = tasks.filter(t => t.completedAt && t.createdAt)
    const avgTime = completedWithTime.length > 0 
      ? completedWithTime.reduce((sum, t) => {
          const days = Math.floor((t.completedAt!.getTime() - t.createdAt.getTime()) / (1000 * 60 * 60 * 24))
          return sum + days
        }, 0) / completedWithTime.length
      : 0
    
    const productivity = total > 0 ? Math.round((completed / total) * 100) : 0
    
    return {
      totalTasks: total,
      completedTasks: completed,
      activeTasks: active,
      overdueTasks: overdue,
      averageCompletionTime: avgTime,
      productivityScore: productivity
    }
  }, [tasks])
  
  const categories = [...new Set(tasks.map(t => t.category).filter((cat): cat is string => Boolean(cat)))]
  const allTags = [...new Set(tasks.flatMap(t => t.tags))]

  return (
    <div className="w-full">
      {/* Analytics Dashboard */}
      <TaskStatsComponent stats={stats} />
      
      {/* Task Creation Form */}
      <TaskForm onSubmit={addTask} templates={templates} />
      
      {/* Search and Filter */}
      {tasks.length > 0 && (
        <SearchAndFilter 
          onSearch={setSearchQuery}
          onFilter={setFilters}
          categories={categories}
          tags={allTags}
        />
      )}
      
      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Active Tasks ({activeTasks.length})
            </h2>
            <div className="text-sm text-gray-500">
              {searchQuery && `Filtered by "${searchQuery}"`}
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {activeTasks
              .sort((a, b) => {
                // Sort by priority (high first), then by due date
                const priorityOrder = { high: 3, medium: 2, low: 1 }
                if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                  return priorityOrder[b.priority] - priorityOrder[a.priority]
                }
                if (a.dueDate && b.dueDate) {
                  return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                }
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              })
              .map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStepToggle={toggleStep}
                  onDelete={deleteTask}
                />
              ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Completed Tasks ({completedTasks.length})
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {completedTasks
              .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
              .map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStepToggle={toggleStep}
                  onDelete={deleteTask}
                />
              ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="text-center py-16 sm:py-20">
          <div className="text-6xl mb-4">🚀</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to boost your productivity?</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Create your first workflow task above and never miss a step in your process again!
          </p>
          <div className="text-sm text-gray-500">
            💡 Try using a template to get started quickly
          </div>
        </div>
      )}
      
      {/* No Results State */}
      {tasks.length > 0 && filteredTasks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-lg">No tasks match your search criteria</p>
          <p className="text-sm mt-2">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  )
}