
export type ProjectType = 'alterations' | 'samples' | 'productions' | 'other';

export type ProjectStatus = 'not_started' | 'in_progress' | 'review' | 'completed';

export interface Project {
  id: string;
  title: string;
  type: ProjectType;
  status: ProjectStatus;
  dueDate: Date;
  notes: string;
  createdAt: Date;
}
