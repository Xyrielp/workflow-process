'use client'

import { useState } from 'react'
import { Building, Users, Calendar, ChevronDown, ChevronUp, Play, Pause, Archive, Edit } from 'lucide-react'
import { BusinessProcess } from '@/types'
import FlowchartWorkflow from './FlowchartWorkflow'

interface ProcessCardProps {
  process: BusinessProcess
  onStepToggle: (processId: string, stepId: string) => void
  onStatusChange: (processId: string, status: 'draft' | 'active' | 'archived') => void
  onEdit?: (processId: string) => void
}

export default function ProcessCard({ process, onStepToggle, onStatusChange, onEdit }: ProcessCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const completedSteps = process.workflow.filter(step => step.status === 'completed').length
  const totalSteps = process.workflow.length
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0
  
  const statusColors = {
    draft: 'bg-gray-100 text-gray-800 border-gray-200',
    active: 'bg-green-100 text-green-800 border-green-200',
    archived: 'bg-red-100 text-red-800 border-red-200'
  }
  
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div 
        className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{process.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[process.status]}`}>
                {process.status.toUpperCase()}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[process.priority]}`}>
                {process.priority.toUpperCase()}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Building size={14} />
                {process.department}
              </div>
              <div className="flex items-center gap-1">
                <Users size={14} />
                {process.owner}
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                v{process.version}
              </div>
            </div>
            
            {process.description && (
              <p className="text-gray-600 text-sm mb-3">{process.description}</p>
            )}
          </div>
          
          <div className="flex items-center gap-3 ml-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">{Math.round(progress)}%</div>
              <div className="text-xs text-gray-500">Complete</div>
            </div>
            {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              progress === 100 ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
          <span>{completedSteps}/{totalSteps} steps completed</span>
          <span>Modified: {new Date(process.lastModified).toLocaleDateString()}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100">
          <div className="p-5">
            {/* Process Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Stakeholders</h4>
                <div className="flex flex-wrap gap-1">
                  {process.stakeholders.map(stakeholder => (
                    <span key={stakeholder} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                      {stakeholder}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Objectives</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {process.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Workflow Visualization */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-4">Process Flow</h4>
              <FlowchartWorkflow 
                steps={process.workflow}
                onStepToggle={(stepId) => onStepToggle(process.id, stepId)}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              {process.status === 'draft' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onStatusChange(process.id, 'active')
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <Play size={16} />
                  Activate Process
                </button>
              )}
              
              {process.status === 'active' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onStatusChange(process.id, 'archived')
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  <Archive size={16} />
                  Archive Process
                </button>
              )}
              
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(process.id)
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <Edit size={16} />
                  Edit Process
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}