
import { Project } from '@/types/project';
import { ProjectCard } from '@/components/ProjectCard';

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  filter?: 'current' | 'completed';
}

export const ProjectList = ({ projects, onEdit, onDelete, filter = 'current' }: ProjectListProps) => {
  const sortedProjects = projects?.sort((a, b) => {
    if (filter === 'completed') {
      // For completed projects, sort by due date descending (most recent first)
      return b.dueDate.getTime() - a.dueDate.getTime();
    } else {
      // For current projects, sort by due date ascending (earliest first)
      return a.dueDate.getTime() - b.dueDate.getTime();
    }
  }) || [];

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
