
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
  fabricSelfImage?: string;
  fabricSelfText?: string;
  fabricCombo1Image?: string;
  fabricCombo1Text?: string;
  fabricCombo2Image?: string;
  fabricCombo2Text?: string;
  fabricLiningImage?: string;
  fabricLiningText?: string;
}

export type ProjectType = 'productions' | 'samples' | 'alterations' | 'other';
export type ProjectStatus = 'not_started' | 'in_progress' | 'completed';
