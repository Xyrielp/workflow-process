'use client'

import { Building, Users, Clock, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { ProcessStats } from '@/types'

interface ProcessDashboardProps {
  stats: ProcessStats
}

export default function ProcessDashboard({ stats }: ProcessDashboardProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Building className="text-blue-600" size={28} />
        Business Process Dashboard
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="text-blue-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.totalProcesses}</div>
              <div className="text-sm text-gray-600">Total Processes</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.activeProcesses}</div>
              <div className="text-sm text-gray-600">Active Processes</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="text-orange-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.blockedTasks}</div>
              <div className="text-sm text-gray-600">Blocked Tasks</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-purple-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.efficiencyScore}%</div>
              <div className="text-sm text-gray-600">Efficiency Score</div>
            </div>
          </div>
        </div>
      </div>

      {Object.keys(stats.departmentBreakdown).length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Users size={18} />
            Department Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.departmentBreakdown).map(([dept, count]) => (
              <div key={dept} className="text-center">
                <div className="text-lg font-bold text-gray-800">{count}</div>
                <div className="text-sm text-gray-600">{dept}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}