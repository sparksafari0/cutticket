
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
  image_url: string | null;
  reference_photos: string[] | null;
  picked_up: boolean | null;
  style_number: string | null;
  fabric_self_image: string | null;
  fabric_self_text: string | null;
  fabric_combo1_image: string | null;
  fabric_combo1_text: string | null;
  fabric_combo2_image: string | null;
  fabric_combo2_text: string | null;
  fabric_lining_image: string | null;
  fabric_lining_text: string | null;
}

// Required fields for insert operations
export interface SupabaseProjectInsert {
  title: string;
  type: string;
  status: string;
  due_date: string;
  notes?: string | null;
  image_url?: string | null;
  reference_photos?: string[] | null;
  picked_up?: boolean | null;
  style_number?: string | null;
  fabric_self_image?: string | null;
  fabric_self_text?: string | null;
  fabric_combo1_image?: string | null;
  fabric_combo1_text?: string | null;
  fabric_combo2_image?: string | null;
  fabric_combo2_text?: string | null;
  fabric_lining_image?: string | null;
  fabric_lining_text?: string | null;
}

// Converter functions between local Project type and Supabase type
export const toSupabaseProject = (project: Partial<Project>): SupabaseProjectInsert => {
  // Make sure required fields are present
  if (!project.title || !project.type || !project.status || !project.dueDate) {
    throw new Error('Missing required fields for project');
  }
  
  return {
    title: project.title,
    type: project.type,
    status: project.status,
    due_date: project.dueDate.toISOString(),
    notes: project.notes || null,
    image_url: project.imageUrl || null,
    reference_photos: project.referencePhotos || null,
    picked_up: project.pickedUp || null,
    style_number: project.styleNumber || null,
    fabric_self_image: project.fabricSelfImage || null,
    fabric_self_text: project.fabricSelfText || null,
    fabric_combo1_image: project.fabricCombo1Image || null,
    fabric_combo1_text: project.fabricCombo1Text || null,
    fabric_combo2_image: project.fabricCombo2Image || null,
    fabric_combo2_text: project.fabricCombo2Text || null,
    fabric_lining_image: project.fabricLiningImage || null,
    fabric_lining_text: project.fabricLiningText || null
  };
};

export const fromSupabaseProject = (project: SupabaseProject): Project => ({
  id: project.id,
  title: project.title,
  styleNumber: project.style_number || undefined,
  type: project.type as ProjectType,
  status: project.status as ProjectStatus,
  dueDate: new Date(project.due_date),
  notes: project.notes || '',
  createdAt: new Date(project.created_at),
  imageUrl: project.image_url || undefined,
  referencePhotos: project.reference_photos || [],
  pickedUp: project.picked_up || false,
  fabricSelfImage: project.fabric_self_image || undefined,
  fabricSelfText: project.fabric_self_text || undefined,
  fabricCombo1Image: project.fabric_combo1_image || undefined,
  fabricCombo1Text: project.fabric_combo1_text || undefined,
  fabricCombo2Image: project.fabric_combo2_image || undefined,
  fabricCombo2Text: project.fabric_combo2_text || undefined,
  fabricLiningImage: project.fabric_lining_image || undefined,
  fabricLiningText: project.fabric_lining_text || undefined
});
