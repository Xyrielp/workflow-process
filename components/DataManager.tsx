'use client'

import { useState } from 'react'
import { Download, Upload, RotateCcw, Save } from 'lucide-react'

interface DataManagerProps {
  processes: any[]
  tasks: any[]
  onDataRestore: (processes: any[], tasks: any[]) => void
}

export default function DataManager({ processes, tasks, onDataRestore }: DataManagerProps) {
  const [showManager, setShowManager] = useState(false)

  const exportData = () => {
    const data = {
      processes,
      tasks,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `process-map-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.processes && data.tasks) {
          onDataRestore(data.processes, data.tasks)
          alert('Data imported successfully!')
        }
      } catch (error) {
        alert('Invalid backup file')
      }
    }
    reader.readAsText(file)
  }

  const forceBackup = () => {
    try {
      localStorage.setItem('business-processes-manual', JSON.stringify(processes))
      localStorage.setItem('workflow-tasks-manual', JSON.stringify(tasks))
      localStorage.setItem('manual-backup-date', new Date().toISOString())
      alert('Manual backup created successfully!')
    } catch (error) {
      alert('Backup failed - storage might be full')
    }
  }

  const restoreFromBackup = () => {
    try {
      const backupProcesses = localStorage.getItem('processes-backup')
      const backupTasks = localStorage.getItem('tasks-backup')
      
      if (backupProcesses && backupTasks) {
        const processData = JSON.parse(backupProcesses)
        const taskData = JSON.parse(backupTasks)
        onDataRestore(processData.data || [], taskData.data || [])
        alert('Data restored from automatic backup!')
      } else {
        alert('No backup found')
      }
    } catch (error) {
      alert('Restore failed')
    }
  }

  if (!showManager) {
    return (
      <button
        onClick={() => setShowManager(true)}
        className="fixed bottom-4 left-4 bg-gray-600 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 z-40"
        title="Data Manager"
      >
        <Save size={20} />
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border rounded-lg shadow-lg p-4 z-50 min-w-[250px]">
      <h3 className="font-semibold mb-3">Data Manager</h3>
      
      <div className="space-y-2">
        <button
          onClick={exportData}
          className="w-full flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          <Download size={16} />
          Export Backup
        </button>
        
        <label className="w-full flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer text-sm">
          <Upload size={16} />
          Import Backup
          <input
            type="file"
            accept=".json"
            onChange={importData}
            className="hidden"
          />
        </label>
        
        <button
          onClick={forceBackup}
          className="w-full flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
        >
          <Save size={16} />
          Force Backup
        </button>
        
        <button
          onClick={restoreFromBackup}
          className="w-full flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
        >
          <RotateCcw size={16} />
          Restore Backup
        </button>
        
        <button
          onClick={() => setShowManager(false)}
          className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
        >
          Close
        </button>
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        <div>Processes: {processes.length}</div>
        <div>Tasks: {tasks.length}</div>
        <div>Auto-saves on every change</div>
      </div>
    </div>
  )
}