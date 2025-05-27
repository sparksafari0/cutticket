
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectActionButtonsProps {
  onEdit: () => void;
  onClose?: () => void;
}

const ProjectActionButtons = ({ onEdit, onClose }: ProjectActionButtonsProps) => {
  return (
    <div className="fixed inset-x-0 bottom-0 p-6 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-center gap-2 max-w-sm mx-auto">
        <Button variant="outline" onClick={onEdit} className="flex-1 shadow-lg">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        {onClose && (
          <Button onClick={onClose} className="flex-1 shadow-lg bg-black text-white hover:bg-gray-800">
            Done
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectActionButtons;
