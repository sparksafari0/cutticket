
import { ProjectType, ProjectStatus } from '@/types/project';

export const PROJECT_TYPES: ProjectType[] = ['alterations', 'samples', 'productions', 'other'];

export const PROJECT_STATUSES: { value: ProjectStatus; label: string; color: string }[] = [
  { value: 'not_started', label: 'Not Started', color: '#F1F0FB' },
  { value: 'in_progress', label: 'In Progress', color: '#FEF7CD' },
  { value: 'completed', label: 'Completed', color: '#F2FCE2' }
];
