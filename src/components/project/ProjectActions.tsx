
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const ProjectActions = ({ onEdit, onDelete }: ProjectActionsProps) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button 
        variant="outline" 
        onClick={onEdit}
      >
        <Edit className="mr-2 h-4 w-4" />
        Edit
      </Button>
      <Button 
        variant="destructive" 
        onClick={onDelete}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  );
};

export default ProjectActions;
