
export interface Project {
  id: string;
  title: string;
  type: ProjectType;
  status: ProjectStatus;
  dueDate: Date;
  createdAt: Date;
  notes?: string;
  imageUrl?: string;
  referencePhotos?: string[];
}

export type ProjectType = 'productions' | 'samples' | 'alterations' | 'other';
export type ProjectStatus = 'not_started' | 'in_progress' | 'completed';
