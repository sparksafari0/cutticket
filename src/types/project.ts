
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

// Export these as named types to fix the TypeScript errors
export type ProjectType = 'productions' | 'series' | 'film' | 'commercial' | 'other';
export type ProjectStatus = 'not_started' | 'in_progress' | 'on_hold' | 'completed';
