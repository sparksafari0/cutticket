
import { useState } from 'react';
import { Project, ProjectType } from '@/types/project';
import { PROJECT_TYPES } from '@/utils/constants';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectForm } from '@/components/ProjectForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const { toast } = useToast();

  const handleAddProject = (data: Partial<Project>) => {
    const newProject = {
      ...data,
      id: Math.random().toString(),
      createdAt: new Date(),
    } as Project;

    setProjects([...projects, newProject]);
    setIsFormOpen(false);
    toast({
      title: "Success",
      description: "Project added successfully",
    });
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleUpdateProject = (data: Partial<Project>) => {
    if (!editingProject) return;

    const updatedProjects = projects.map((p) =>
      p.id === editingProject.id ? { ...editingProject, ...data } : p
    );

    setProjects(updatedProjects);
    setIsFormOpen(false);
    setEditingProject(undefined);
    toast({
      title: "Success",
      description: "Project updated successfully",
    });
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    toast({
      title: "Success",
      description: "Project deleted successfully",
    });
  };

  const projectsByType = PROJECT_TYPES.reduce((acc, type) => {
    acc[type] = projects.filter((p) => p.type === type);
    return acc;
  }, {} as Record<ProjectType, Project[]>);

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
