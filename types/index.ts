export interface WorkflowStep {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  order: number;
  estimatedTime?: number; // in minutes
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
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
}

export interface TaskTemplate {
  id: string;
  name: string;
  description?: string;
  workflow: Omit<WorkflowStep, 'id' | 'completed'>[];
  category?: string;
  tags: string[];
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  overdueTasks: number;
  averageCompletionTime: number;
  productivityScore: number;
}