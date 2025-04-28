
import { useState } from 'react';
import { Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ProjectForm } from '@/components/ProjectForm';
import { ProjectList } from '@/components/ProjectList';
import { useProjects } from '@/hooks/useProjects';

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const { projects, isLoading, addProject, updateProject, deleteProject } = useProjects();

  const handleAddProject = (data: Partial<Project>) => {
    addProject.mutate(data);
    setIsFormOpen(false);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleUpdateProject = (data: Partial<Project>) => {
    if (!editingProject) return;
    updateProject.mutate({ ...data, id: editingProject.id });
    setIsFormOpen(false);
    setEditingProject(undefined);
  };

  const handleDeleteProject = (id: string) => {
    deleteProject.mutate(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="sticky top-0 z-10 flex justify-between items-center mb-6 py-4 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-900">Production Tracker</h1>
          <Button onClick={() => setIsFormOpen(true)} className="pointer-events-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>

        {projects.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-500 mb-4">No projects yet</p>
            <Button onClick={() => setIsFormOpen(true)} variant="outline" className="pointer-events-auto">
              Create your first project
            </Button>
          </div>
        )}

        <ProjectList
          projects={projects}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
        />

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
