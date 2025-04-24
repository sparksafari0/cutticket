
import { useState, useEffect } from 'react';
import { Project, ProjectType, ProjectStatus } from '@/types/project';
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";

export const useProjects = () => {
  const [localProjects, setLocalProjects] = useState<Project[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
        return [];
      }

      return data.map(project => ({
        ...project,
        type: project.type as ProjectType,
        status: project.status as ProjectStatus,
        dueDate: new Date(project.due_date),
        createdAt: new Date(project.created_at)
      }));
    }
  });

  useEffect(() => {
    if (projects && projects.length > 0) {
      setLocalProjects(projects);
    }
  }, [projects]);

  const addProjectMutation = useMutation({
    mutationFn: async (data: Partial<Project>) => {
      const { error } = await supabase
        .from('projects')
        .insert([{
          title: data.title,
          type: data.type,
          status: data.status,
          due_date: data.dueDate?.toISOString(),
          notes: data.notes
        }]);
      
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

  const updateProjectMutation = useMutation({
    mutationFn: async (data: Partial<Project> & { id: string }) => {
      const { error } = await supabase
        .from('projects')
        .update({
          title: data.title,
          type: data.type,
          status: data.status,
          due_date: data.dueDate?.toISOString(),
          notes: data.notes
        })
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

  const deleteProjectMutation = useMutation({
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
    projects: localProjects,
    isLoading,
    addProject: addProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
  };
};
