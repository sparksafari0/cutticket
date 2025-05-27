
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Project } from '@/types/project';
import { fromSupabaseProject, toSupabaseProject } from '@/types/supabaseTypes';

export function useProjects() {
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data ? data.map(fromSupabaseProject) : [];
    }
  });

  const addProject = useMutation({
    mutationFn: async (data: Partial<Project>) => {
      const supabaseData = toSupabaseProject(data);
      const { error } = await supabase
        .from('projects')
        .insert(supabaseData);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  const updateProject = useMutation({
    mutationFn: async (data: Partial<Project>) => {
      if (!data.id) return;
      
      // Create a minimal update object with only the fields being changed
      const updateData: any = {};
      
      // Only include status if it's provided
      if (data.status) {
        updateData.status = data.status;
      }
      
      // Add any other provided fields to update
      if (data.title) updateData.title = data.title;
      if (data.styleNumber !== undefined) updateData.style_number = data.styleNumber;
      if (data.type) updateData.type = data.type;
      if (data.dueDate) updateData.due_date = data.dueDate.toISOString();
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.imageUrl !== undefined) updateData.image_url = data.imageUrl;
      if (data.referencePhotos !== undefined) updateData.reference_photos = data.referencePhotos;
      if (data.pickedUp !== undefined) updateData.picked_up = data.pickedUp;
      if (data.fabricSelfImage !== undefined) updateData.fabric_self_image = data.fabricSelfImage;
      if (data.fabricSelfText !== undefined) updateData.fabric_self_text = data.fabricSelfText;
      if (data.fabricCombo1Image !== undefined) updateData.fabric_combo1_image = data.fabricCombo1Image;
      if (data.fabricCombo1Text !== undefined) updateData.fabric_combo1_text = data.fabricCombo1Text;
      if (data.fabricCombo2Image !== undefined) updateData.fabric_combo2_image = data.fabricCombo2Image;
      if (data.fabricCombo2Text !== undefined) updateData.fabric_combo2_text = data.fabricCombo2Text;
      if (data.fabricLiningImage !== undefined) updateData.fabric_lining_image = data.fabricLiningImage;
      if (data.fabricLiningText !== undefined) updateData.fabric_lining_text = data.fabricLiningText;
      
      console.log("Updating project with ID:", data.id);
      console.log("Update data:", updateData);
      
      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', data.id);
        
      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  return {
    projects,
    isLoading,
    addProject,
    updateProject,
    deleteProject
  };
}
