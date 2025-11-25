'use client'

import { BarChart3, Clock, Target, TrendingUp } from 'lucide-react'
import { TaskStats } from '@/types'

interface TaskStatsProps {
  stats: TaskStats
}

export default function TaskStatsComponent({ stats }: TaskStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Target className="text-blue-500" size={18} />
          <span className="text-xs font-medium text-gray-600">TOTAL</span>
        </div>
        <div className="text-xl font-bold text-gray-800">{stats.totalTasks}</div>
        <div className="text-xs text-gray-500">Tasks</div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="text-green-500" size={18} />
          <span className="text-xs font-medium text-gray-600">DONE</span>
        </div>
        <div className="text-xl font-bold text-gray-800">{stats.completedTasks}</div>
        <div className="text-xs text-gray-500">Completed</div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="text-orange-500" size={18} />
          <span className="text-xs font-medium text-gray-600">ACTIVE</span>
        </div>
        <div className="text-xl font-bold text-gray-800">{stats.activeTasks}</div>
        <div className="text-xs text-gray-500">In Progress</div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="text-purple-500" size={18} />
          <span className="text-xs font-medium text-gray-600">SCORE</span>
        </div>
        <div className="text-xl font-bold text-gray-800">{stats.productivityScore}%</div>
        <div className="text-xs text-gray-500">Productivity</div>
      </div>
    </div>
  )
}