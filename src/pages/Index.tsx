
import { useState, useEffect } from 'react';
import { Project, ProjectType } from '@/types/project';
import { PROJECT_TYPES } from '@/utils/constants';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectForm } from '@/components/ProjectForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch projects
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(project => ({
        ...project,
        dueDate: new Date(project.due_date),
        createdAt: new Date(project.created_at)
      }));
    }
  });

  // Add project mutation
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
      setIsFormOpen(false);
      toast({
        title: "Success",
        description: "Project added successfully",
      });
    }
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async (data: Partial<Project>) => {
      if (!editingProject?.id) return;
      const { error } = await supabase
        .from('projects')
        .update({
          title: data.title,
          type: data.type,
          status: data.status,
          due_date: data.dueDate?.toISOString(),
          notes: data.notes
        })
        .eq('id', editingProject.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsFormOpen(false);
      setEditingProject(undefined);
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    }
  });

  // Delete project mutation
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
    }
  });

  const handleAddProject = (data: Partial<Project>) => {
    addProjectMutation.mutate(data);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleUpdateProject = (data: Partial<Project>) => {
    updateProjectMutation.mutate(data);
  };

  const handleDeleteProject = (id: string) => {
    deleteProjectMutation.mutate(id);
  };

  const projectsByType = PROJECT_TYPES.reduce((acc, type) => {
    acc[type] = projects.filter((p) => p.type === type);
    return acc;
  }, {} as Record<ProjectType, Project[]>);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Production Tracker</h1>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>

        <div className="space-y-6">
          {PROJECT_TYPES.map((type) => (
            <div key={type}>
              <h2 className="text-lg font-semibold mb-3 capitalize">{type}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectsByType[type]?.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={handleEditProject}
                    onDelete={handleDeleteProject}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <ProjectForm
          open={isFormOpen}
          onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) setEditingProject(undefined);
          }}
          onSubmit={editingProject ? handleUpdateProject : handleAddProject}
          initialData={editingProject}
        />
      </div>
    </div>
  );
};

export default Index;
