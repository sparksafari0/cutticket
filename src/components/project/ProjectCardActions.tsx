
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
    <div className="flex gap-2">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleEditClick}
        aria-label="Edit project"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleDeleteClick} 
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
        aria-label="Delete project"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ProjectCardActions;
