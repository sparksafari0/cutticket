
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

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
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
    bgColor = '#FEF7CD'; // Soft yellow for due today
  } else if (daysLeft === 1) {
    daysLeftText = '1 day left';
    bgColor = '#FEF7CD'; // Soft yellow for due soon
  } else {
    daysLeftText = `${daysLeft} days left`;
    bgColor = '#F2FCE2'; // Soft green for plenty of time
  }

  return (
    <Card className="w-full">
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
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{project.title}</h3>
              <div 
                className="px-2 py-1 rounded text-sm capitalize"
                style={{ backgroundColor: status?.color }}
              >
                {status?.label}
              </div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Tag className="mr-2 h-4 w-4" />
              <span className="capitalize">{project.type}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 py-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              Due: {format(project.dueDate, 'MMM dd, yyyy')}
            </div>
            
            {/* Days left highlighted section (replacing notes) */}
            <div 
              className="mt-2 px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center"
              style={{ backgroundColor: bgColor }}
            >
              {daysLeftText}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(project)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(project.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

