
import { useState, useEffect } from 'react';
import { Project, ProjectType, ProjectStatus } from '@/types/project';
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
  const [localProjects, setLocalProjects] = useState<Project[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch projects
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data.map(project => ({
          ...project,
          // Convert string types from database to proper enum types for TypeScript
          type: project.type as ProjectType,
          status: project.status as ProjectStatus,
          dueDate: new Date(project.due_date),
          createdAt: new Date(project.created_at)
        }));
      } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
      }
    },
    onSuccess: (data) => {
      if (data.length > 0) {
        setLocalProjects(data);
      }
    }
  });

  // Add project mutation
  const addProjectMutation = useMutation({
    mutationFn: async (data: Partial<Project>) => {
      try {
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
      } catch (error) {
        console.error("Error adding project to Supabase:", error);
        // Even if Supabase fails, we'll add to local state
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsFormOpen(false);
      toast({
        title: "Success",
        description: "Project added successfully",
      });
    },
    onError: () => {
      // Handle local state addition on error
      toast({
        title: "Note",
        description: "Project stored locally. Connect to Supabase for cloud storage.",
      });
    }
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async (data: Partial<Project>) => {
      if (!editingProject?.id) return;
      try {
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
      } catch (error) {
        console.error("Error updating project in Supabase:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsFormOpen(false);
      setEditingProject(undefined);
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    },
    onError: () => {
      // Handle local update
      toast({
        title: "Note",
        description: "Project updated locally. Connect to Supabase for cloud storage.",
      });
    }
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (error) {
        console.error("Error deleting project from Supabase:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    },
    onError: () => {
      // Handle local delete
      toast({
        title: "Note",
        description: "Project deleted locally. Connect to Supabase for cloud storage.",
      });
    }
  });

  const handleAddProject = (data: Partial<Project>) => {
    // Create a new project with local ID
    const newProject: Project = {
      id: `local-${Date.now()}`,
      title: data.title || 'Untitled Project',
      type: data.type || 'productions',
      status: data.status || 'not_started',
      dueDate: data.dueDate || new Date(),
      notes: data.notes || '',
      createdAt: new Date()
    };
    
    // Add to local state first
    setLocalProjects(prev => [newProject, ...prev]);
    
    // Try to add to Supabase
    try {
      addProjectMutation.mutate(data);
    } catch (error) {
      console.log("Continuing with local storage only");
    }
    
    // Close form regardless of Supabase result
    setIsFormOpen(false);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleUpdateProject = (data: Partial<Project>) => {
    if (!editingProject) return;
    
    // Update in local state first
    setLocalProjects(prev => 
      prev.map(p => p.id === editingProject.id ? { ...p, ...data } as Project : p)
    );
    
    // Try to update in Supabase
    try {
      updateProjectMutation.mutate(data);
    } catch (error) {
      console.log("Continuing with local storage only");
    }
    
    // Close form regardless
    setIsFormOpen(false);
    setEditingProject(undefined);
  };

  const handleDeleteProject = (id: string) => {
    // Delete from local state first
    setLocalProjects(prev => prev.filter(p => p.id !== id));
    
    // Try to delete from Supabase
    try {
      deleteProjectMutation.mutate(id);
    } catch (error) {
      console.log("Continuing with local storage only");
    }
  };
  
  const sortedProjects = localProjects?.sort((a, b) => 
    a.dueDate.getTime() - b.dueDate.getTime()
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Production Tracker</h1>
          <Button onClick={() => setIsFormOpen(true)} className="pointer-events-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>

        {sortedProjects.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-500 mb-4">No projects yet</p>
            <Button onClick={() => setIsFormOpen(true)} variant="outline" className="pointer-events-auto">
              Create your first project
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
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
