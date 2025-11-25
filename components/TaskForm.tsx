'use client'

import { useState } from 'react'
import { Plus, X, Calendar, Clock, Tag, Zap } from 'lucide-react'
import { Task, WorkflowStep, TaskTemplate } from '@/types'

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void
  templates?: TaskTemplate[]
}

export default function TaskForm({ onSubmit, templates = [] }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [category, setCategory] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState('')
  const [steps, setSteps] = useState<Omit<WorkflowStep, 'id' | 'completed'>[]>([])
  const [currentStep, setCurrentStep] = useState('')
  const [currentStepTime, setCurrentStepTime] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')

  const addStep = () => {
    if (currentStep.trim()) {
      setSteps([...steps, { 
        title: currentStep.trim(), 
        order: steps.length,
        estimatedTime: currentStepTime ? parseInt(currentStepTime) : undefined,
        priority: 'medium'
      }])
      setCurrentStep('')
      setCurrentStepTime('')
    }
  }

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const loadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setTitle(template.name)
      setDescription(template.description || '')
      setCategory(template.category || '')
      setTags(template.tags)
      setSteps(template.workflow)
    }
  }

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && steps.length > 0) {
      const totalEstimatedTime = steps.reduce((sum, step) => sum + (step.estimatedTime || 0), 0)
      
      onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        category: category.trim() || undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        tags,
        estimatedTotalTime: totalEstimatedTime || undefined,
        workflow: steps.map((step, index) => ({
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
          ...step,
          order: index,
          completed: false
        }))
      })
      
      // Reset form
      setTitle('')
      setDescription('')
      setPriority('medium')
      setCategory('')
      setDueDate('')
      setTags([])
      setSteps([])
      setSelectedTemplate('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Create New Task</h2>
      
      {templates.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Use Template</label>
          <select
            value={selectedTemplate}
            onChange={(e) => {
              setSelectedTemplate(e.target.value)
              if (e.target.value) loadTemplate(e.target.value)
            }}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Start from scratch</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>{template.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="w-full p-4 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">🟢 Low Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="high">🔴 High Priority</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <input
            type="text"
            placeholder="Category (optional)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              <Tag size={12} />
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-blue-600">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add tag"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="button" onClick={addTag} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-medium mb-3">Workflow Steps</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
          <input
            type="text"
            placeholder="Add workflow step"
            value={currentStep}
            onChange={(e) => setCurrentStep(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStep())}
            className="sm:col-span-2 p-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                placeholder="Min"
                value={currentStepTime}
                onChange={(e) => setCurrentStepTime(e.target.value)}
                className="w-full pl-8 pr-2 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={addStep}
              className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 flex items-center justify-center"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {steps.length > 0 && (
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600 min-w-[24px]">#{index + 1}</span>
                <span className="flex-1 text-sm sm:text-base">{step.title}</span>
                {step.estimatedTime && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    {step.estimatedTime}m
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="text-red-500 hover:text-red-700 active:text-red-800 p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
            <div className="text-right text-sm text-gray-600">
              Total estimated time: {steps.reduce((sum, step) => sum + (step.estimatedTime || 0), 0)} minutes
            </div>
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