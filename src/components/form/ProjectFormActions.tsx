
import { Button } from '@/components/ui/button';
import { Project } from '@/types/project';
import { X } from 'lucide-react';

interface ProjectFormActionsProps {
  initialData?: Project;
  onCancel?: () => void;
}

export const ProjectFormActions = ({
  initialData,
  onCancel
}: ProjectFormActionsProps) => {
  return (
    <>
      {onCancel && (
        <div className="absolute top-6 right-6 z-10">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={onCancel} 
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      )}
      
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-10">
        <Button type="submit" className="shadow-lg">
          {initialData ? 'Update Project' : 'Add Project'}
        </Button>
      </div>
    </>
  );
};
