
import { Project, ProjectType, ProjectStatus } from '@/types/project';

// Definition for the projects table in Supabase
export interface SupabaseProject {
  id: string;
  title: string;
  type: string;
  status: string;
  due_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Converter functions between local Project type and Supabase type
export const toSupabaseProject = (project: Partial<Project>): Partial<SupabaseProject> => ({
  title: project.title,
  type: project.type,
  status: project.status,
  due_date: project.dueDate?.toISOString(),
  notes: project.notes
});

export const fromSupabaseProject = (project: SupabaseProject): Project => ({
  id: project.id,
  title: project.title,
  type: project.type as ProjectType,
  status: project.status as ProjectStatus,
  dueDate: new Date(project.due_date),
  notes: project.notes || '',
  createdAt: new Date(project.created_at)
});
