
import { format, differenceInDays } from 'date-fns';
import { Project } from '@/types/project';
import { PROJECT_STATUSES } from '@/utils/constants';
import { cn } from '@/lib/utils';
import { Calendar, Edit, Trash2, Tag, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const status = PROJECT_STATUSES.find(s => s.value === project.status);
  
  // Calculate days left until due date
  const today = new Date();
  const daysLeft = differenceInDays(project.dueDate, today);
  
  // Set display text and style based on days left
  let daysLeftText = '';
  let bgColor = '#F1F0FB'; // Default light purple/gray
  
  if (daysLeft < 0) {
    daysLeftText = `${Math.abs(daysLeft)} days overdue`;
    bgColor = '#FFDEE2'; // Soft pink/red for overdue
  } else if (daysLeft === 0) {
    daysLeftText = 'Due today';
    bgColor = '#ea384c20'; // Redish color with transparency for due today
  } else if (daysLeft === 1) {
    daysLeftText = '1 day left';
    bgColor = '#F9731620'; // Orange color with transparency for 1 day left
  } else {
    daysLeftText = `${daysLeft} days left`;
    bgColor = '#F2FCE2'; // Soft green for plenty of time
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open dialog if clicking on buttons
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    setDialogOpen(true);
  };

  return (
    <>
      <Card className="w-full cursor-pointer" onClick={handleCardClick}>
        <div className="flex">
          {/* Image section on the left */}
          <div className="w-1/3 p-4 flex items-center justify-center">
            {project.imageUrl ? (
              <div className="w-full h-32 relative rounded-md overflow-hidden">
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                <Image className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Content section on the right */}
          <div className="w-2/3">
            <CardHeader className="space-y-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <h3 className="text-lg font-medium truncate max-w-[180px]">{project.title}</h3>
                <div 
                  className={cn(
                    "px-2 py-1 rounded text-sm capitalize whitespace-nowrap",
                    isMobile && "self-center"
                  )}
                  style={{ backgroundColor: status?.color }}
                >
                  {status?.label}
                </div>
              </div>
              <div className="flex items-center text-sm text-muted-foreground mt-0">
                <Tag className="mr-2 h-4 w-4" />
                <span className="capitalize">{project.type}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 py-0"> {/* Changed py-1 to py-0 to reduce vertical space */}
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                Due: {format(project.dueDate, 'MMM dd, yyyy')}
              </div>
              
              {/* Days left highlighted section (replacing notes) */}
              <div 
                className="mt-2 px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center w-full"
                style={{ backgroundColor: bgColor }}
              >
                {daysLeftText}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(project);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(project.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{project.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-2">
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
            
            {/* Days Left */}
            <div 
              className="px-3 py-2 rounded-md text-center font-medium"
              style={{ backgroundColor: bgColor }}
            >
              {daysLeftText}
            </div>
            
            {/* Notes */}
            {project.notes && (
              <div className="space-y-2">
                <h3 className="font-medium">Notes:</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <p className="whitespace-pre-wrap">{project.notes}</p>
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
                onClick={() => {
                  setDialogOpen(false);
                  onDelete(project.id);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

