'use client'

import { CheckCircle, Circle, ArrowDown } from 'lucide-react'
import { WorkflowStep } from '@/types'

interface FlowchartWorkflowProps {
  steps: WorkflowStep[]
  onStepToggle: (stepId: string) => void
}

export default function FlowchartWorkflow({ steps, onStepToggle }: FlowchartWorkflowProps) {
  const sortedSteps = steps.sort((a, b) => a.order - b.order)

  return (
    <div className="relative py-4">
      <div className="flex flex-col items-center space-y-4">
        {/* Start Node */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
            START
          </div>
          <ArrowDown className="text-gray-400 mt-2" size={20} />
        </div>

        {/* Workflow Steps */}
        {sortedSteps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            {/* Step Box */}
            <div
              onClick={() => onStepToggle(step.id)}
              className={`relative cursor-pointer transition-all duration-300 ${
                step.completed 
                  ? 'transform scale-105' 
                  : 'hover:transform hover:scale-105 hover:shadow-lg'
              }`}
            >
              {/* Flowchart Box */}
              <div className={`
                w-64 sm:w-80 min-h-[80px] p-4 rounded-lg border-2 flex items-center gap-3
                ${step.completed 
                  ? 'bg-green-50 border-green-400 shadow-green-100 shadow-lg' 
                  : step.priority === 'high' 
                    ? 'bg-red-50 border-red-300 hover:border-red-400' 
                    : step.priority === 'medium'
                      ? 'bg-yellow-50 border-yellow-300 hover:border-yellow-400'
                      : 'bg-blue-50 border-blue-300 hover:border-blue-400'
                }
              `}>
                {/* Status Icon */}
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  step.completed 
                    ? 'bg-green-500 border-green-500' 
                    : 'bg-white border-gray-300'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="text-white" size={18} />
                  ) : (
                    <Circle className="text-gray-400" size={18} />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium text-sm sm:text-base ${
                      step.completed ? 'line-through text-gray-600' : 'text-gray-800'
                    }`}>
                      {step.title}
                    </span>
                    
                    {/* Priority Indicator */}
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      step.priority === 'high' ? 'bg-red-200 text-red-800' :
                      step.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-green-200 text-green-800'
                    }`}>
                      {step.priority === 'high' ? '🔴 HIGH' : 
                       step.priority === 'medium' ? '🟡 MED' : '🟢 LOW'}
                    </span>
                  </div>

                  {/* Step Details */}
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      Step {step.order + 1}
                    </span>
                    {step.estimatedTime && (
                      <span className="flex items-center gap-1">
                        ⏱️ {step.estimatedTime}m
                      </span>
                    )}
                  </div>

                  {step.description && (
                    <p className="text-xs text-gray-600 mt-2 overflow-hidden">
                      {step.description}
                    </p>
                  )}
                </div>

                {/* Completion Badge */}
                {step.completed && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
              </div>
            </div>

            {/* Connector Arrow */}
            {index < sortedSteps.length - 1 && (
              <div className="flex flex-col items-center my-2">
                <div className={`w-0.5 h-6 ${
                  step.completed ? 'bg-green-400' : 'bg-gray-300'
                }`}></div>
                <ArrowDown className={`${
                  step.completed ? 'text-green-500' : 'text-gray-400'
                }`} size={20} />
                <div className={`w-0.5 h-6 ${
                  step.completed ? 'bg-green-400' : 'bg-gray-300'
                }`}></div>
              </div>
            )}
          </div>
        ))}

        {/* End Node */}
        <div className="flex flex-col items-center mt-4">
          <div className={`w-16 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            steps.every(step => step.completed)
              ? 'bg-green-500 text-white animate-pulse'
              : 'bg-gray-300 text-gray-600'
          }`}>
            END
          </div>
          
          {steps.every(step => step.completed) && (
            <div className="mt-3 text-center">
              <div className="text-2xl mb-1">🎉</div>
              <div className="text-sm font-medium text-green-600">
                Workflow Complete!
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-sm border p-3">
        <div className="text-xs text-gray-600 mb-1">Progress</div>
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${steps.length > 0 ? (steps.filter(s => s.completed).length / steps.length) * 100 : 0}%` 
              }}
            />
          </div>
          <span className="text-xs font-bold text-gray-700">
            {steps.length > 0 ? Math.round((steps.filter(s => s.completed).length / steps.length) * 100) : 0}%
          </span>
        </div>
      </div>
    </div>
  )
}