'use client'

import { useState } from 'react'
import { Plus, X, ArrowDown, Square } from 'lucide-react'
import { WorkflowStep } from '@/types'

interface FlowchartBuilderProps {
  steps: Omit<WorkflowStep, 'id' | 'completed'>[]
  onStepsChange: (steps: Omit<WorkflowStep, 'id' | 'completed'>[]) => void
}

export default function FlowchartBuilder({ steps, onStepsChange }: FlowchartBuilderProps) {
  const [currentStep, setCurrentStep] = useState('')

  const [currentPriority, setCurrentPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [currentTime, setCurrentTime] = useState('')

  const addStep = () => {
    if (currentStep.trim()) {
      const newStep = {
        title: currentStep.trim(),
        order: steps.length,
        priority: currentPriority,
        estimatedTime: currentTime ? parseInt(currentTime) : undefined,
      }
      onStepsChange([...steps, newStep])
      setCurrentStep('')
      setCurrentTime('')
    }
  }

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, order: i }))
    onStepsChange(newSteps)
  }

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === steps.length - 1)
    ) return

    const newSteps = [...steps]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]]
    
    // Update order numbers
    newSteps.forEach((step, i) => step.order = i)
    onStepsChange(newSteps)
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700">Build Your Flowchart</h3>
      
      {/* Add Step Form */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <input
            type="text"
            placeholder="Step description"
            value={currentStep}
            onChange={(e) => setCurrentStep(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addStep()}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            value={currentPriority}
            onChange={(e) => setCurrentPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">🟢 Low Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="high">🔴 High Priority</option>
          </select>
          
          <input
            type="number"
            placeholder="Minutes"
            value={currentTime}
            onChange={(e) => setCurrentTime(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            onClick={addStep}
            disabled={!currentStep.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Add Step
          </button>
        </div>
      </div>

      {/* Flowchart Preview */}
      {steps.length > 0 && (
        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-4">Flowchart Preview</h4>
          
          <div className="flex flex-col items-center space-y-3">
            {/* Start */}
            <div className="w-20 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
              START
            </div>
            
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <ArrowDown className="text-gray-400" size={16} />
                
                {/* Step Box */}
                <div className="relative group">
                  <div className={`w-64 p-3 rounded-lg border-2 flex items-center gap-3 ${
                    step.priority === 'high' ? 'bg-red-50 border-red-300' :
                    step.priority === 'medium' ? 'bg-yellow-50 border-yellow-300' :
                    'bg-blue-50 border-blue-300'
                  }`}>
                    <Square className="text-gray-600" size={16} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">
                        {step.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>Step {step.order + 1}</span>
                        {step.estimatedTime && <span>⏱️ {step.estimatedTime}m</span>}
                        <span className={`px-1 rounded text-xs ${
                          step.priority === 'high' ? 'bg-red-200 text-red-800' :
                          step.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-green-200 text-green-800'
                        }`}>
                          {step.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Controls */}
                  <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                    {index > 0 && (
                      <button
                        onClick={() => moveStep(index, 'up')}
                        className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-blue-600"
                        title="Move up"
                      >
                        ↑
                      </button>
                    )}
                    {index < steps.length - 1 && (
                      <button
                        onClick={() => moveStep(index, 'down')}
                        className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-blue-600"
                        title="Move down"
                      >
                        ↓
                      </button>
                    )}
                    <button
                      onClick={() => removeStep(index)}
                      className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      title="Remove step"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <ArrowDown className="text-gray-400" size={16} />
            
            {/* End */}
            <div className="w-20 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-bold">
              END
            </div>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            Total estimated time: {steps.reduce((sum, step) => sum + (step.estimatedTime || 0), 0)} minutes
          </div>
        </div>
      )}
    </div>
  )
}