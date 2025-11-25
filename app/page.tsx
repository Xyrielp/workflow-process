'use client'

import { useState, useEffect } from 'react'
import TaskForm from '@/components/TaskForm'
import TaskCard from '@/components/TaskCard'
import { Task } from '@/types'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])

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
      createdAt: new Date()
    }
    setTasks(prev => [newTask, ...prev])
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

  const activeTasks = tasks.filter(task => !task.completedAt)
  const completedTasks = tasks.filter(task => task.completedAt)

  return (
    <div className="w-full">
      <TaskForm onSubmit={addTask} />
      
      {activeTasks.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Active Tasks</h2>
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {activeTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onStepToggle={toggleStep}
              />
            ))}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Completed Tasks</h2>
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {completedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onStepToggle={toggleStep}
              />
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="text-center py-12 sm:py-16 text-gray-500">
          <p className="text-base sm:text-lg px-4">No tasks yet. Create your first task above!</p>
        </div>
      )}
    </div>
  )
}