
import { Button } from '@/components/ui/button';
import { Project } from '@/types/project';
import { X } from 'lucide-react';

interface ProjectFormActionsProps {
  initialData?: Project;
  onCancel?: () => void;
}

export const ProjectFormActions = ({ initialData, onCancel }: ProjectFormActionsProps) => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-10">
      {onCancel && (
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          onClick={onCancel}
          className="rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      
      <Button 
        type="submit" 
        className="shadow-lg"
      >
        {initialData ? 'Update Project' : 'Add Project'}
      </Button>
    </div>
  );
};
