
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
  // Stop event propagation to prevent card click from opening the dialog
  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation();
    callback();
  };
  
  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => handleButtonClick(e, () => onEdit(project))}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={(e) => handleButtonClick(e, () => onDelete(project.id))}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ProjectCardActions;
