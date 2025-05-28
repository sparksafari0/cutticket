
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProjectForm } from '@/components/ProjectForm';
import { ProjectList } from '@/components/ProjectList';
import { useProjects } from '@/hooks/useProjects';

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const { projects, isLoading, addProject, updateProject, deleteProject } = useProjects();

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    deleteProject.mutate(id);
  };

  const handleFormSubmit = (data) => {
    if (editingProject) {
      updateProject.mutate({ ...editingProject, ...data });
    } else {
      addProject.mutate(data);
    }
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Project Manager</h1>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link to="/generate-sketch" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto text-sm">
                Generate Sketch
              </Button>
            </Link>
            <Button onClick={() => setIsFormOpen(true)} className="w-full sm:w-auto text-sm">
              Add New Project
            </Button>
          </div>
        </div>

        {/* Project List */}
        <ProjectList 
          projects={projects} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Project Form Modal */}
        <ProjectForm 
          open={isFormOpen} 
          onOpenChange={handleFormClose}
          onSubmit={handleFormSubmit}
          initialData={editingProject}
          onDelete={editingProject ? () => handleDelete(editingProject.id) : undefined}
        />
      </div>
    </div>
  );
};

export default Index;
