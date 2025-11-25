'use client'

import { useState } from 'react'
import { Plus, X, Users, Building, Calendar, Target } from 'lucide-react'
import { BusinessProcess, WorkflowStep } from '@/types'

interface ProcessBuilderProps {
  onSubmit: (process: Omit<BusinessProcess, 'id' | 'createdAt' | 'lastModified'>) => void
  departments: string[]
  roles: string[]
}

export default function ProcessBuilder({ onSubmit, departments, roles }: ProcessBuilderProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [department, setDepartment] = useState('')
  const [owner, setOwner] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [stakeholders, setStakeholders] = useState<string[]>([])
  const [objectives, setObjectives] = useState<string[]>([])
  const [currentStakeholder, setCurrentStakeholder] = useState('')
  const [currentObjective, setCurrentObjective] = useState('')
  const [steps, setSteps] = useState<Omit<WorkflowStep, 'id' | 'completed' | 'status'>[]>([])

  const addStakeholder = () => {
    if (currentStakeholder.trim() && !stakeholders.includes(currentStakeholder.trim())) {
      setStakeholders([...stakeholders, currentStakeholder.trim()])
      setCurrentStakeholder('')
    }
  }

  const addObjective = () => {
    if (currentObjective.trim()) {
      setObjectives([...objectives, currentObjective.trim()])
      setCurrentObjective('')
    }
  }

  const addStep = (stepData: Omit<WorkflowStep, 'id' | 'completed' | 'status'>) => {
    setSteps([...steps, { ...stepData, order: steps.length }])
  }

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index).map((step, i) => ({ ...step, order: i })))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && department && owner && steps.length > 0) {
      onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        department,
        owner,
        category,
        priority,
        status: 'draft',
        version: '1.0',
        stakeholders,
        objectives,
        tags: [],
        workflow: steps.map((step, index) => ({
          ...step,
          id: crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15),
          order: index,
          completed: false,
          status: 'not-started' as const
        }))
      })
      
      // Reset form
      setName('')
      setDescription('')
      setDepartment('')
      setOwner('')
      setCategory('')
      setStakeholders([])
      setObjectives([])
      setSteps([])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Building size={24} className="text-blue-600" />
        Create Business Process
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Process Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">🟢 Low Priority</option>
          <option value="medium">🟡 Medium Priority</option>
          <option value="high">🔴 High Priority</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Department</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        
        <input
          type="text"
          placeholder="Process Owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <textarea
        placeholder="Process Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Stakeholders</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add stakeholder"
              value={currentStakeholder}
              onChange={(e) => setCurrentStakeholder(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStakeholder())}
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="button" onClick={addStakeholder} className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {stakeholders.map(stakeholder => (
              <span key={stakeholder} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                <Users size={12} />
                {stakeholder}
                <button type="button" onClick={() => setStakeholders(stakeholders.filter(s => s !== stakeholder))}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Objectives</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add objective"
              value={currentObjective}
              onChange={(e) => setCurrentObjective(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="button" onClick={addObjective} className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {objectives.map((objective, index) => (
              <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                <Target size={12} />
                {objective}
                <button type="button" onClick={() => setObjectives(objectives.filter((_, i) => i !== index))}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <ProcessStepBuilder 
        steps={steps}
        onStepsChange={setSteps}
        departments={departments}
        roles={roles}
      />

      <button
        type="submit"
        disabled={!name.trim() || !department || !owner || steps.length === 0}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 font-medium"
      >
        Create Business Process
      </button>
    </form>
  )
}

interface ProcessStepBuilderProps {
  steps: Omit<WorkflowStep, 'id' | 'completed' | 'status'>[]
  onStepsChange: (steps: Omit<WorkflowStep, 'id' | 'completed' | 'status'>[]) => void
  departments: string[]
  roles: string[]
}

function ProcessStepBuilder({ steps, onStepsChange, departments, roles }: ProcessStepBuilderProps) {
  const [currentStep, setCurrentStep] = useState('')
  const [currentAssignee, setCurrentAssignee] = useState('')
  const [currentDepartment, setCurrentDepartment] = useState('')
  const [currentRole, setCurrentRole] = useState('')
  const [estimatedTime, setEstimatedTime] = useState('')
  const [approvalRequired, setApprovalRequired] = useState(false)

  const addStep = () => {
    if (currentStep.trim()) {
      const newStep = {
        title: currentStep.trim(),
        order: steps.length,
        assignedTo: currentAssignee || undefined,
        department: currentDepartment || undefined,
        role: currentRole || undefined,
        estimatedTime: estimatedTime ? parseInt(estimatedTime, 10) : undefined,
        approvalRequired,
        priority: 'medium' as const
      }
      onStepsChange([...steps, newStep])
      setCurrentStep('')
      setCurrentAssignee('')
      setCurrentDepartment('')
      setCurrentRole('')
      setEstimatedTime('')
      setApprovalRequired(false)
    }
  }

  return (
    <div className="mb-6">
      <h3 className="font-medium text-gray-700 mb-4">Process Steps</h3>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
          <input
            type="text"
            placeholder="Step description"
            value={currentStep}
            onChange={(e) => setCurrentStep(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Assigned to"
            value={currentAssignee}
            onChange={(e) => setCurrentAssignee(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={currentDepartment}
            onChange={(e) => setCurrentDepartment(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <select
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Role</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Est. time (hours)"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            min="1"
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="flex items-center gap-2 p-2">
            <input
              type="checkbox"
              checked={approvalRequired}
              onChange={(e) => setApprovalRequired(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Requires Approval</span>
          </label>
        </div>
        
        <button
          type="button"
          onClick={addStep}
          disabled={!currentStep.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
        >
          Add Step
        </button>
      </div>

      {steps.length > 0 && (
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-white border rounded-lg">
              <span className="text-sm font-medium text-gray-600 min-w-[30px]">#{index + 1}</span>
              <div className="flex-1">
                <div className="font-medium">{step.title}</div>
                <div className="text-sm text-gray-500 flex items-center gap-4">
                  {step.assignedTo && <span>👤 {step.assignedTo}</span>}
                  {step.department && <span>🏢 {step.department}</span>}
                  {step.role && <span>💼 {step.role}</span>}
                  {step.estimatedTime && <span>⏱️ {step.estimatedTime}h</span>}
                  {step.approvalRequired && <span>✅ Approval Required</span>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onStepsChange(steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i })))}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}