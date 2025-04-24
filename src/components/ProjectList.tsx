
import { Project } from '@/types/project';
import { ProjectCard } from '@/components/ProjectCard';

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectList = ({ projects, onEdit, onDelete }: ProjectListProps) => {
  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
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
