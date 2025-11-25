'use client'

import { useState, useEffect, useMemo } from 'react'
import ProcessBuilder from '@/components/ProcessBuilder'
import ProcessCard from '@/components/ProcessCard'
import ProcessDashboard from '@/components/ProcessDashboard'
import TaskForm from '@/components/TaskForm'
import TaskCard from '@/components/TaskCard'
import SearchAndFilter from '@/components/SearchAndFilter'
import { BusinessProcess, Task, ProcessStats, TaskStats } from '@/types'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'processes' | 'tasks'>('processes')
  const [processes, setProcesses] = useState<BusinessProcess[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<{
    priority?: 'low' | 'medium' | 'high'
    category?: string
    status?: 'active' | 'completed' | 'overdue'
    tags?: string[]
  }>({})
  
  const departments = ['Sales', 'Marketing', 'Operations', 'HR', 'Finance', 'IT', 'Customer Service', 'Legal']
  const roles = ['Manager', 'Analyst', 'Coordinator', 'Specialist', 'Director', 'Associate', 'Lead', 'Executive']


  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load processes
      const savedProcesses = localStorage.getItem('business-processes')
      if (savedProcesses) {
        try {
          const parsedProcesses = JSON.parse(savedProcesses)
          if (Array.isArray(parsedProcesses)) {
            setProcesses(parsedProcesses.map((process: any) => ({
              ...process,
              createdAt: new Date(process.createdAt),
              lastModified: new Date(process.lastModified)
            })))
          }
        } catch (error) {
          console.error('Error loading processes:', error)
          localStorage.removeItem('business-processes')
        }
      }
      
      // Load tasks
      const savedTasks = localStorage.getItem('workflow-tasks')
      if (savedTasks) {
        try {
          const parsedTasks = JSON.parse(savedTasks)
          if (Array.isArray(parsedTasks)) {
            setTasks(parsedTasks.map((task: any) => ({
              ...task,
              createdAt: new Date(task.createdAt),
              completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
              dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
              tags: task.tags || [],
              priority: task.priority || 'medium'
            })))
          }
        } catch (error) {
          console.error('Error loading tasks:', error)
          localStorage.removeItem('workflow-tasks')
        }
      }
    }
  }, [])

  // Save data to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (processes.length > 0) {
          localStorage.setItem('business-processes', JSON.stringify(processes))
        } else {
          localStorage.removeItem('business-processes')
        }
      } catch (error) {
        console.error('Error saving processes:', error)
      }
    }
  }, [processes])
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (tasks.length > 0) {
          localStorage.setItem('workflow-tasks', JSON.stringify(tasks))
        } else {
          localStorage.removeItem('workflow-tasks')
        }
      } catch (error) {
        console.error('Error saving tasks:', error)
      }
    }
  }, [tasks])

  const addProcess = (processData: Omit<BusinessProcess, 'id' | 'createdAt' | 'lastModified'>) => {
    const newProcess: BusinessProcess = {
      ...processData,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      createdAt: new Date(),
      lastModified: new Date()
    }
    setProcesses(prev => [newProcess, ...prev])
  }
  
  const updateProcessStatus = (processId: string, status: 'draft' | 'active' | 'archived') => {
    setProcesses(prev => prev.map(process => 
      process.id === processId 
        ? { ...process, status, lastModified: new Date() }
        : process
    ))
  }
  
  const toggleProcessStep = (processId: string, stepId: string) => {
    setProcesses(prev => prev.map(process => {
      if (process.id === processId) {
        const updatedWorkflow = process.workflow.map(step => 
          step.id === stepId 
            ? { ...step, status: step.status === 'completed' ? 'not-started' : 'completed' as const }
            : step
        )
        return { ...process, workflow: updatedWorkflow, lastModified: new Date() }
      }
      return process
    }))
  }

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
  
  // Process Analytics
  const processStats: ProcessStats = useMemo(() => {
    const total = processes.length
    const active = processes.filter(p => p.status === 'active').length
    const allTasks = processes.flatMap(p => p.workflow)
    const completed = allTasks.filter(t => t.status === 'completed').length
    const blocked = allTasks.filter(t => t.status === 'blocked').length
    
    const deptBreakdown = processes.reduce((acc, process) => {
      acc[process.department] = (acc[process.department] || 0) + 1
      return acc
    }, {} as { [key: string]: number })
    
    const efficiency = allTasks.length > 0 ? Math.round((completed / allTasks.length) * 100) : 0
    
    return {
      totalProcesses: total,
      activeProcesses: active,
      completedTasks: completed,
      blockedTasks: blocked,
      departmentBreakdown: deptBreakdown,
      averageProcessTime: 0,
      efficiencyScore: efficiency
    }
  }, [processes])
  
  // Task Analytics
  const taskStats: TaskStats = useMemo(() => {
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
  
  const categories = [...new Set([...tasks.map(t => t.category), ...processes.map(p => p.category)].filter((cat): cat is string => Boolean(cat)))]
  const allTags = [...new Set([...tasks.flatMap(t => t.tags), ...processes.flatMap(p => p.tags)])]
  
  const activeProcesses = processes.filter(p => p.status === 'active')
  const draftProcesses = processes.filter(p => p.status === 'draft')
  const archivedProcesses = processes.filter(p => p.status === 'archived')

  return (
    <div className="w-full">
      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('processes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'processes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Business Processes
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Individual Tasks
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'processes' ? (
        <>
          {/* Process Dashboard */}
          <ProcessDashboard stats={processStats} />
          
          {/* Process Creation Form */}
          <ProcessBuilder 
            onSubmit={addProcess}
            departments={departments}
            roles={roles}
          />
          
          {/* Active Processes */}
          {activeProcesses.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Active Processes ({activeProcesses.length})
              </h2>
              <div className="space-y-4">
                {activeProcesses.map(process => (
                  <ProcessCard
                    key={process.id}
                    process={process}
                    onStepToggle={toggleProcessStep}
                    onStatusChange={updateProcessStatus}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Draft Processes */}
          {draftProcesses.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Draft Processes ({draftProcesses.length})
              </h2>
              <div className="space-y-4">
                {draftProcesses.map(process => (
                  <ProcessCard
                    key={process.id}
                    process={process}
                    onStepToggle={toggleProcessStep}
                    onStatusChange={updateProcessStatus}
                  />
                ))}
              </div>
            </div>
          )}
          
          {processes.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Start Mapping Your Business Processes</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Create structured workflows to organize your business operations and ensure nothing falls through the cracks.
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Task Creation Form */}
          <TaskForm onSubmit={addTask} />
      
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
        </>
      )}
    </div>
  )
}