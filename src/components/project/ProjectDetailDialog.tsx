
import { format } from 'date-fns';
import { Project } from '@/types/project';
import { PROJECT_STATUSES } from '@/utils/constants';
import { Edit, Trash2, Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';

interface ProjectDetailDialogProps {
  project: Project;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectDetailDialog = ({ 
  project, 
  dialogOpen, 
  setDialogOpen, 
  onEdit, 
  onDelete 
}: ProjectDetailDialogProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);
  
  const status = PROJECT_STATUSES.find(s => s.value === project.status);
  
  // Calculate days left for background color
  const today = new Date();
  const daysLeft = Math.floor((project.dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Set display text and style based on days left
  let daysLeftText = '';
  let bgColor = '#F1F0FB'; // Default light purple/gray
  
  if (daysLeft < 0) {
    daysLeftText = `${Math.abs(daysLeft)} days overdue`;
    bgColor = '#FFDEE2';
  } else if (daysLeft === 0) {
    daysLeftText = 'Due today';
    bgColor = '#ea384c20';
  } else if (daysLeft === 1) {
    daysLeftText = '1 day left';
    bgColor = '#F9731620';
  } else {
    daysLeftText = `${daysLeft} days left`;
    bgColor = '#F2FCE2';
  }

  const handleDelete = () => {
    setDeleteDialogOpen(false);
    setDialogOpen(false);
    onDelete(project.id);
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <div className="fixed top-0 right-0 left-0 bg-background z-10 pt-6 pb-2 px-6 flex items-center justify-between">
            <DialogHeader className="p-0">
              <DialogTitle className="text-xl font-semibold">{project.title}</DialogTitle>
            </DialogHeader>
            <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
          
          <div className="space-y-4 mt-12">
            {/* Image - Fixed to contain instead of cover to show full image */}
            {project.imageUrl ? (
              <div className="w-full h-48 sm:h-64 relative rounded-md overflow-hidden">
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-full h-48 sm:h-64 bg-gray-100 rounded-md flex items-center justify-center">
                <Image className="h-12 w-12 text-gray-400" />
              </div>
            )}
            
            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status:</span>
              <div 
                className="px-2 py-1 rounded text-sm capitalize"
                style={{ backgroundColor: status?.color }}
              >
                {status?.label}
              </div>
            </div>
            
            {/* Type */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="capitalize">{project.type}</span>
            </div>
            
            {/* Due Date */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Due Date:</span>
              <span>{format(project.dueDate, 'MMMM dd, yyyy')}</span>
            </div>
            
            {/* Days Left - Only show if project is not completed */}
            {project.status !== 'completed' && (
              <div 
                className="px-3 py-2 rounded-md text-center font-medium"
                style={{ backgroundColor: bgColor }}
              >
                {daysLeftText}
              </div>
            )}
            
            {/* Notes */}
            {project.notes && (
              <div className="space-y-2">
                <h3 className="font-medium">Notes:</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <p className="whitespace-pre-wrap">{project.notes}</p>
                </div>
              </div>
            )}
            
            {/* Reference Photos */}
            {project.referencePhotos && project.referencePhotos.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Reference Photos:</h3>
                <div className="grid grid-cols-3 gap-2">
                  {project.referencePhotos.map((photo, index) => (
                    <div 
                      key={index} 
                      className="aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer"
                      onClick={() => setExpandedPhoto(photo)}
                    >
                      <img 
                        src={photo} 
                        alt={`Reference ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setDialogOpen(false);
                  onEdit(project);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Photo Expanded View Dialog */}
      {expandedPhoto && (
        <Dialog open={!!expandedPhoto} onOpenChange={() => setExpandedPhoto(null)}>
          <DialogContent className="sm:max-w-[700px] p-0">
            <div className="p-1 relative">
              <img
                src={expandedPhoto}
                alt="Reference"
                className="w-full h-auto object-contain max-h-[80vh]"
              />
              <DialogClose className="absolute top-2 right-2 rounded-full bg-background/80 p-1">
                <X className="h-4 w-4" />
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the project &quot;{project.title}&quot;. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectDetailDialog;
