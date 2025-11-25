export interface WorkflowStep {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  order: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  workflow: WorkflowStep[];
  createdAt: Date;
  completedAt?: Date;
}