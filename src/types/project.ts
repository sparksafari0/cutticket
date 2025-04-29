
export interface Project {
  id: string;
  title: string;
  type: 'productions' | 'series' | 'film' | 'commercial' | 'other';
  status: 'not_started' | 'in_progress' | 'on_hold' | 'completed';
  dueDate: Date;
  createdAt: Date;
  notes?: string;
  imageUrl?: string;
  referencePhotos?: string[];
}
