'use client'

import { useState } from 'react'
import { CheckCircle, Circle, Clock, ChevronDown, ChevronUp, Calendar, Tag, AlertTriangle, Timer } from 'lucide-react'
import { Task } from '@/types'
import FlowchartWorkflow from './FlowchartWorkflow'

interface TaskCardProps {
  task: Task
  onStepToggle: (taskId: string, stepId: string) => void
  onDelete?: (taskId: string) => void
}

export default function TaskCard({ task, onStepToggle, onDelete }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const completedSteps = task.workflow.filter(step => step.completed).length
  const totalSteps = task.workflow.length
  const progress = (completedSteps / totalSteps) * 100
  
  const isOverdue = task.dueDate && new Date() > task.dueDate && !task.completedAt
  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
    high: 'bg-red-100 text-red-800 border-red-200'
  }
  const priorityIcons = { low: '🟢', medium: '🟡', high: '🔴' }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
      isOverdue ? 'border-red-500' : 
      task.priority === 'high' ? 'border-red-300' :
      task.priority === 'medium' ? 'border-yellow-300' : 'border-green-300'
    }`}>
      {/* Header - Always Visible */}
      <div 
        className="p-4 sm:p-5 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{task.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
                {priorityIcons[task.priority]} {task.priority.toUpperCase()}
              </span>
              {isOverdue && <AlertTriangle className="text-red-500" size={16} />}
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span className="font-medium">{completedSteps}/{totalSteps} steps</span>
              
              <div className="flex items-center gap-1">
                <Clock size={12} />
                {new Date(task.createdAt).toLocaleDateString()}
              </div>
              
              {task.dueDate && (
                <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                  <Calendar size={12} />
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </div>
              )}
              
              {task.estimatedTotalTime && (
                <div className="flex items-center gap-1">
                  <Timer size={12} />
                  ~{task.estimatedTotalTime}m
                </div>
              )}
            </div>
            
            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {task.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
                {task.tags.length > 3 && (
                  <span className="text-xs text-gray-400">+{task.tags.length - 3} more</span>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 ml-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              progress === 100 ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <span className={`text-xs font-bold ${
                progress === 100 ? 'text-green-600' : 'text-gray-600'
              }`}>{Math.round(progress)}%</span>
            </div>
            {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
          </div>
        </div>
        
        {/* Enhanced Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              progress === 100 ? 'bg-green-500' :
              task.priority === 'high' ? 'bg-red-500' :
              task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
            }`}
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
          
          {task.category && (
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                📁 {task.category}
              </span>
            </div>
          )}
          
          {/* Flowchart Workflow */}
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-700 text-sm">Workflow Flowchart:</h4>
              {task.estimatedTotalTime && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Timer size={12} />
                  Est. {task.estimatedTotalTime} min total
                </span>
              )}
            </div>
            
            <FlowchartWorkflow 
              steps={task.workflow}
              onStepToggle={(stepId) => onStepToggle(task.id, stepId)}
            />
          </div>

          {completedSteps === totalSteps && (
            <div className="mt-5 p-4 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 rounded-lg text-center">
              <div className="text-2xl mb-2">🎉</div>
              <div className="font-bold text-lg">Task Completed!</div>
              <div className="text-sm opacity-75 mt-1">
                Completed on {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'today'}
              </div>
            </div>
          )}
          
          {onDelete && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => onDelete(task.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete Task
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}