
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

export type ProjectType = 'productions' | 'series' | 'film' | 'commercial' | 'alterations' | 'samples' | 'other';
export type ProjectStatus = 'not_started' | 'in_progress' | 'on_hold' | 'completed';
