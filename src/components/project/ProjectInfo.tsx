
import { format } from 'date-fns';
import { PROJECT_STATUSES } from '@/utils/constants';
import { Project } from '@/types/project';
import { Image } from 'lucide-react';

interface ProjectInfoProps {
  project: Project;
  onSetExpandedPhoto: (photo: string) => void;
}

const ProjectInfo = ({ project, onSetExpandedPhoto }: ProjectInfoProps) => {
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

  return (
    <div className="space-y-4">
      {/* Image - Fixed to contain instead of cover to show full image */}
      {project.imageUrl ? (
        <div className="w-full h-48 sm:h-64 relative rounded-md overflow-hidden cursor-pointer" onClick={() => onSetExpandedPhoto(project.imageUrl!)}>
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
    </div>
  );
};

export default ProjectInfo;
