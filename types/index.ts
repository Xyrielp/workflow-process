export interface WorkflowStep {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  order: number;
  estimatedTime?: number;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  assignedTo?: string;
  department?: string;
  role?: string;
  dependencies?: string[];
  deliverables?: string[];
  approvalRequired?: boolean;
  approvedBy?: string;
  startDate?: Date;
  endDate?: Date;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked' | 'approved';
}

export interface BusinessProcess {
  id: string;
  name: string;
  description?: string;
  department: string;
  owner: string;
  workflow: WorkflowStep[];
  createdAt: Date;
  lastModified: Date;
  version: string;
  status: 'draft' | 'active' | 'archived';
  priority: 'low' | 'medium' | 'high';
  category: string;
  tags: string[];
  estimatedDuration?: number;
  stakeholders: string[];
  objectives: string[];
  kpis?: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  workflow: WorkflowStep[];
  createdAt: Date;
  completedAt?: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  tags: string[];
  estimatedTotalTime?: number;
  actualTimeSpent?: number;
  processId?: string;
  assignedTo?: string;
  department?: string;
}

export interface ProcessTemplate {
  id: string;
  name: string;
  description?: string;
  department: string;
  workflow: Omit<WorkflowStep, 'id' | 'completed' | 'status'>[];
  category: string;
  tags: string[];
  stakeholders: string[];
  objectives: string[];
}

export interface TaskTemplate {
  id: string;
  name: string;
  description?: string;
  workflow: Omit<WorkflowStep, 'id' | 'completed' | 'status'>[];
  category?: string;
  tags: string[];
}

export interface ProcessStats {
  totalProcesses: number;
  activeProcesses: number;
  completedTasks: number;
  blockedTasks: number;
  departmentBreakdown: { [key: string]: number };
  averageProcessTime: number;
  efficiencyScore: number;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  overdueTasks: number;
  averageCompletionTime: number;
  productivityScore: number;
}