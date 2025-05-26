import { useState } from 'react';
import { Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ProjectForm } from '@/components/ProjectForm';
import { ProjectList } from '@/components/ProjectList';
import { useProjects } from '@/hooks/useProjects';

type FilterType = 'current' | 'completed';

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [filter, setFilter] = useState<FilterType>('current');
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
    setIsFormOpen(false);
    setEditingProject(undefined);
  };

  const handleDeleteFromForm = () => {
    if (editingProject) {
      handleDeleteProject(editingProject.id);
    }
  };

  // Filter projects based on current filter
  const filteredProjects = projects.filter(project => {
    if (filter === 'current') {
      return project.status === 'not_started' || project.status === 'in_progress';
    } else {
      return project.status === 'completed';
    }
  });

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

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-6">
          <Button
            variant={filter === 'current' ? 'default' : 'outline'}
            onClick={() => setFilter('current')}
            className="px-6 py-2 rounded-full font-medium transition-all duration-200"
          >
            Current
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
            className="px-6 py-2 rounded-full font-medium transition-all duration-200"
          >
            Completed
          </Button>
        </div>

        {filteredProjects.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-500 mb-4">
              {filter === 'current' ? 'No current projects' : 'No completed projects'}
            </p>
            <Button onClick={() => setIsFormOpen(true)} variant="outline" className="pointer-events-auto">
              Create your first project
            </Button>
          </div>
        )}

        <ProjectList
          projects={filteredProjects}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          filter={filter}
        />

        <ProjectForm
          open={isFormOpen}
          onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) setEditingProject(undefined);
          }}
          onSubmit={editingProject ? handleUpdateProject : handleAddProject}
          initialData={editingProject}
          onDelete={editingProject ? handleDeleteFromForm : undefined}
        />
      </div>
    </div>
  );
};

export default Index;
