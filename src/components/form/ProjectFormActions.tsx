
import { Button } from '@/components/ui/button';
import { Project } from '@/types/project';
import { X, Trash2 } from 'lucide-react';

interface ProjectFormActionsProps {
  initialData?: Project;
  onCancel?: () => void;
  onDelete?: () => void;
}

export const ProjectFormActions = ({
  initialData,
  onCancel,
  onDelete
}: ProjectFormActionsProps) => {
  // Handle close button click separately to prevent event propagation
  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation
    
    // Call onCancel to close the form and return to the detail view
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <>
      {onCancel && (
        <div className="fixed top-2 right-2 z-50 sm:top-4 sm:right-4">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={handleCloseClick} 
            className="h-10 w-10 sm:h-8 sm:w-8 bg-background/90 backdrop-blur-sm border border-border/50 rounded-full shadow-lg hover:bg-background/95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-5 w-5 sm:h-4 sm:w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      )}
      
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-10">
        {onDelete && initialData && (
          <Button 
            type="button" 
            variant="destructive" 
            onClick={onDelete}
            className="shadow-lg w-[130px]"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
        <Button type="submit" className="shadow-lg w-[130px]">
          {initialData ? 'Update Project' : 'Add Project'}
        </Button>
      </div>
    </>
  );
};
