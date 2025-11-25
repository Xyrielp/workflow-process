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
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2">
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 leading-tight">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 mt-2 text-sm sm:text-base">{task.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 shrink-0">
          <Clock size={14} className="sm:w-4 sm:h-4" />
          {new Date(task.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span className="font-medium">Progress</span>
          <span className="font-medium">{completedSteps}/{totalSteps} steps</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-gray-700 text-sm sm:text-base">Workflow Steps:</h4>
        {task.workflow
          .sort((a, b) => a.order - b.order)
          .map((step) => (
            <div
              key={step.id}
              className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all duration-200 min-h-[56px] ${
                step.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50 hover:bg-gray-100 active:bg-gray-200'
              }`}
              onClick={() => onStepToggle(task.id, step.id)}
            >
              {step.completed ? (
                <CheckCircle className="text-green-500 shrink-0" size={24} />
              ) : (
                <Circle className="text-gray-400 shrink-0" size={24} />
              )}
              <span className={`flex-1 text-sm sm:text-base leading-relaxed ${
                step.completed ? 'line-through text-gray-500' : 'text-gray-800'
              }`}>
                {step.title}
              </span>
              <span className="text-xs text-gray-400 font-medium shrink-0">#{step.order + 1}</span>
            </div>
          ))}
      </div>

      {completedSteps === totalSteps && (
        <div className="mt-5 p-4 bg-green-100 text-green-800 rounded-lg text-center font-medium text-sm sm:text-base">
          ✅ Task Completed!
        </div>
      )}
    </div>
  )
}