'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Task, WorkflowStep } from '@/types'

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [steps, setSteps] = useState<Omit<WorkflowStep, 'id' | 'completed'>[]>([])
  const [currentStep, setCurrentStep] = useState('')

  const addStep = () => {
    if (currentStep.trim()) {
      setSteps([...steps, { title: currentStep.trim(), order: steps.length }])
      setCurrentStep('')
    }
  }

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && steps.length > 0) {
      onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        workflow: steps.map((step, index) => ({
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
          ...step,
          order: index,
          completed: false
        }))
      })
      setTitle('')
      setDescription('')
      setSteps([])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Create New Task</h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-4 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <textarea
          placeholder="Task description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-4 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <h3 className="font-medium mb-3">Workflow Steps</h3>
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <input
            type="text"
            placeholder="Add workflow step"
            value={currentStep}
            onChange={(e) => setCurrentStep(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStep())}
            className="flex-1 p-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addStep}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 flex items-center justify-center gap-2 font-medium min-h-[48px]"
          >
            <Plus size={18} /> <span>Add</span>
          </button>
        </div>

        {steps.length > 0 && (
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600 min-w-[24px]">#{index + 1}</span>
                <span className="flex-1 text-sm sm:text-base">{step.title}</span>
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="text-red-500 hover:text-red-700 active:text-red-800 p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!title.trim() || steps.length === 0}
        className="w-full py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 active:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium text-base min-h-[48px]"
      >
        Create Task
      </button>
    </form>
  )
}