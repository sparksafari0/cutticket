
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectActionButtonsProps {
  onEdit: () => void;
  onClose?: () => void;
}

const ProjectActionButtons = ({ onEdit, onClose }: ProjectActionButtonsProps) => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-10">
      <Button variant="outline" onClick={onEdit} className="w-[130px] shadow-lg">
        <Edit className="mr-2 h-4 w-4" />
        Edit
      </Button>
      {onClose && (
        <Button onClick={onClose} className="w-[130px] shadow-lg bg-black text-white hover:bg-gray-800">
          Done
        </Button>
      )}
    </div>
  );
};

export default ProjectActionButtons;
