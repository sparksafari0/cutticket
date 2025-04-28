
import { format, differenceInDays } from 'date-fns';
import { Project } from '@/types/project';
import { PROJECT_STATUSES } from '@/utils/constants';
import { cn } from '@/lib/utils';
import { Calendar, Tag, Image } from 'lucide-react';
import { CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import ProjectCardActions from './ProjectCardActions';

interface ProjectCardContentProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectCardContent = ({ project, onEdit, onDelete }: ProjectCardContentProps) => {
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

  return (
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
        <CardContent className="space-y-1 py-0">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            Due: {format(project.dueDate, 'MMM dd, yyyy')}
          </div>
          
          {/* Days left highlighted section */}
          <div 
            className="mt-2 px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center w-full"
            style={{ backgroundColor: bgColor }}
          >
            {daysLeftText}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <ProjectCardActions 
            project={project}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </CardFooter>
      </div>
    </div>
  );
};

export default ProjectCardContent;
