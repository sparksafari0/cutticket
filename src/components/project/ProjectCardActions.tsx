import { Project } from '@/types/project';

interface ProjectCardActionsProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectCardActions = ({
  project,
  onEdit,
  onDelete
}: ProjectCardActionsProps) => {
  // Keep the handlers in case they're needed by other components
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(project);
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(project.id);
  };
  
  // Return null instead of the buttons
  return null;
};

export default ProjectCardActions;
