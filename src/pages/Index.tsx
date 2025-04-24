
import { useState } from 'react';
import { Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ProjectForm } from '@/components/ProjectForm';
import { ProjectList } from '@/components/ProjectList';
import { EmptyProjectState } from '@/components/EmptyProjectState';
import { useProjects } from '@/hooks/useProjects';

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const { projects, isLoading, addProject, updateProject, deleteProject } = useProjects();

  const handleAddProject = (data: Partial<Project>) => {
    const newProject: Project = {
      id: `local-${Date.now()}`,
      title: data.title || 'Untitled Project',
      type: data.type || 'productions',
      status: data.status || 'not_started',
      dueDate: data.dueDate || new Date(),
      notes: data.notes || '',
      createdAt: new Date()
    };
    
    addProject(newProject);
    setIsFormOpen(false);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleUpdateProject = (data: Partial<Project>) => {
    if (!editingProject?.id) return;
    updateProject({ ...data, id: editingProject.id });
    setIsFormOpen(false);
    setEditingProject(undefined);
  };

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

        {!isLoading && projects.length === 0 && (
          <EmptyProjectState onCreateProject={() => setIsFormOpen(true)} />
        )}

        <ProjectList
          projects={projects}
          onEdit={handleEditProject}
          onDelete={deleteProject}
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
