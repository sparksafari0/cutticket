
import { Project } from '@/types/project';
import { ProjectCard } from '@/components/ProjectCard';

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  projectToReopen?: string | null;
}

export const ProjectList = ({ projects, onEdit, onDelete, projectToReopen }: ProjectListProps) => {
  const sortedProjects = projects?.sort((a, b) => 
    a.dueDate.getTime() - b.dueDate.getTime()
  ) || [];

  if (sortedProjects.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedProjects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
