'use client'

import { useState } from 'react'
import { CheckCircle, Circle, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { Task } from '@/types'

interface TaskCardProps {
  task: Task
  onStepToggle: (taskId: string, stepId: string) => void
}

export default function TaskCard({ task, onStepToggle }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const completedSteps = task.workflow.filter(step => step.completed).length
  const totalSteps = task.workflow.length
  const progress = (completedSteps / totalSteps) * 100

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header - Always Visible */}
      <div 
        className="p-4 sm:p-5 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{task.title}</h3>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs sm:text-sm text-gray-500 font-medium">
                {completedSteps}/{totalSteps} steps
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={12} />
                {new Date(task.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600">{Math.round(progress)}%</span>
            </div>
            {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
          </div>
        </div>
        
        {/* Mini Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-gray-100">
          {task.description && (
            <p className="text-gray-600 text-sm sm:text-base mb-4 mt-3">{task.description}</p>
          )}
          
          {/* Dot Map Workflow */}
          <div className="relative">
            <h4 className="font-medium text-gray-700 text-sm mb-4">Workflow Progress:</h4>
            <div className="space-y-1">
              {task.workflow
                .sort((a, b) => a.order - b.order)
                .map((step, index) => (
                  <div key={step.id} className="relative">
                    {/* Connecting Line */}
                    {index < task.workflow.length - 1 && (
                      <div className="absolute left-3 top-8 w-0.5 h-6 bg-gray-300"></div>
                    )}
                    
                    {/* Step Item */}
                    <div
                      className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors min-h-[48px]"
                      onClick={() => onStepToggle(task.id, step.id)}
                    >
                      {/* Dot */}
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        step.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'bg-white border-gray-300 hover:border-blue-400'
                      }`}>
                        {step.completed && <CheckCircle className="text-white" size={14} />}
                        {!step.completed && <div className="w-2 h-2 bg-gray-300 rounded-full"></div>}
                      </div>
                      
                      {/* Step Content */}
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm sm:text-base block ${
                          step.completed ? 'line-through text-gray-500' : 'text-gray-800'
                        }`}>
                          {step.title}
                        </span>
                      </div>
                      
                      {/* Step Number */}
                      <span className="text-xs text-gray-400 font-medium shrink-0">
                        {step.order + 1}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {completedSteps === totalSteps && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-center font-medium text-sm">
              ✅ Task Completed!
            </div>
          )}
        </div>
      )}
    </div>
  )
}