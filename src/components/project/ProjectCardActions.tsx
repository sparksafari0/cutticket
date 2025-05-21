
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

  return (
    <div className="flex space-x-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleEditClick}
        className="h-8 w-8"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleDeleteClick}
        className="h-8 w-8 text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ProjectCardActions;
