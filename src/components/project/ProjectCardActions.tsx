import { Project } from '@/types/project';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  // Prevent event bubbling to avoid triggering card click when clicking on action buttons
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(project);
  };
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(project.id);
  };
  return;
};
export default ProjectCardActions;