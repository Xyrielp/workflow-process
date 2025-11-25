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
          id: crypto.randomUUID(),
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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <textarea
          placeholder="Task description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <h3 className="font-medium mb-2">Workflow Steps</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Add workflow step"
            value={currentStep}
            onChange={(e) => setCurrentStep(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStep())}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addStep}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-1"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        {steps.length > 0 && (
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">#{index + 1}</span>
                <span className="flex-1">{step.title}</span>
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!title.trim() || steps.length === 0}
        className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Create Task
      </button>
    </form>
  )
}