'use client'

import { CheckCircle, Circle, Clock } from 'lucide-react'
import { Task } from '@/types'

interface TaskCardProps {
  task: Task
  onStepToggle: (taskId: string, stepId: string) => void
}

export default function TaskCard({ task, onStepToggle }: TaskCardProps) {
  const completedSteps = task.workflow.filter(step => step.completed).length
  const totalSteps = task.workflow.length
  const progress = (completedSteps / totalSteps) * 100

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 mt-1">{task.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={16} />
          {new Date(task.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{completedSteps}/{totalSteps} steps</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-gray-700">Workflow Steps:</h4>
        {task.workflow
          .sort((a, b) => a.order - b.order)
          .map((step) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                step.completed ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => onStepToggle(task.id, step.id)}
            >
              {step.completed ? (
                <CheckCircle className="text-green-500" size={20} />
              ) : (
                <Circle className="text-gray-400" size={20} />
              )}
              <span className={`flex-1 ${step.completed ? 'line-through text-gray-500' : ''}`}>
                {step.title}
              </span>
              <span className="text-xs text-gray-400">#{step.order + 1}</span>
            </div>
          ))}
      </div>

      {completedSteps === totalSteps && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-center font-medium">
          ✅ Task Completed!
        </div>
      )}
    </div>
  )
}