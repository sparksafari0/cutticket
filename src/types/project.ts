
export interface Project {
  id: string;
  title: string;
  styleNumber?: string;
  type: ProjectType;
  status: ProjectStatus;
  dueDate: Date;
  createdAt: Date;
  notes?: string;
  imageUrl?: string;
  referencePhotos?: string[];
  pickedUp?: boolean;
}

export type ProjectType = 'productions' | 'samples' | 'alterations' | 'other';
export type ProjectStatus = 'not_started' | 'in_progress' | 'completed';
