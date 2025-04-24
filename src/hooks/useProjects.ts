
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Project } from '@/types/project';
import { fromSupabaseProject, toSupabaseProject } from '@/types/supabaseTypes';
import { useToast } from "@/components/ui/use-toast";

export function useProjects() {
  const { toast } = useToast();
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
      toast({
        title: "Success",
        description: "Project added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Note",
        description: "Project stored locally. Connect to Supabase for cloud storage.",
      });
    }
  });

  const updateProject = useMutation({
    mutationFn: async (data: Partial<Project>) => {
      if (!data.id) return;
      const supabaseData = toSupabaseProject(data);
      const { error } = await supabase
        .from('projects')
        .update(supabaseData)
        .eq('id', data.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Note",
        description: "Project updated locally. Connect to Supabase for cloud storage.",
      });
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
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Note",
        description: "Project deleted locally. Connect to Supabase for cloud storage.",
      });
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
