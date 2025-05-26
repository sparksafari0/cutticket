
import { format } from 'date-fns';
import { PROJECT_STATUSES } from '@/utils/constants';
import { Project } from '@/types/project';
import { Image, Check, X } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectStatus } from "@/types/project";
import ReferencePhotosGrid from './ReferencePhotosGrid';
import ProjectActions from './ProjectActions';

interface ProjectInfoProps {
  project: Project;
  onSetExpandedPhoto: (photo: string) => void;
  onPickedUpChange?: (pickedUp: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange?: (status: Project['status']) => void;
}

const ProjectInfo = ({ 
  project, 
  onSetExpandedPhoto, 
  onPickedUpChange,
  onEdit,
  onDelete,
  onStatusChange
}: ProjectInfoProps) => {
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
      
      {/* Reference Photos - Display immediately after main image */}
      {project.referencePhotos && project.referencePhotos.length > 0 && (
        <div className="mt-2">
          <ReferencePhotosGrid 
            photos={project.referencePhotos} 
            onPhotoClick={onSetExpandedPhoto} 
          />
        </div>
      )}
      
      {/* Project Actions - Right after reference photos, but only show Edit button */}
      <div className="flex justify-end">
        <ProjectActions 
          onEdit={onEdit} 
          status={project.status} 
          hideStatusSelector={true}
        />
      </div>
      
      {/* Status - Now with selector */}
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Status:</span>
        {onStatusChange ? (
          <div className="relative z-[100]">
            <Select defaultValue={project.status} onValueChange={(value) => {
              console.log("Value selected:", value);
              if (onStatusChange) {
                onStatusChange(value as ProjectStatus);
              }
            }}>
              <SelectTrigger className="w-[130px] h-8 text-sm" style={{
                backgroundColor: status?.color || 'transparent',
                color: 'black'
              }}>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="z-[100] bg-white" position="popper">
                {PROJECT_STATUSES.map(statusOption => (
                  <SelectItem 
                    key={statusOption.value} 
                    value={statusOption.value} 
                    className="capitalize cursor-pointer text-sm" 
                    style={{
                      backgroundColor: project.status === statusOption.value ? statusOption.color : undefined
                    }}
                  >
                    {statusOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div 
            className="px-2 py-1 rounded text-sm capitalize"
            style={{ backgroundColor: status?.color }}
          >
            {status?.label}
          </div>
        )}
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
      
      {/* Picked Up - Only show if project is completed */}
      {project.status === 'completed' && (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Picked Up:</span>
          {onPickedUpChange ? (
            <div className="flex gap-2">
              <Toggle
                variant="outline"
                pressed={project.pickedUp === true}
                onPressedChange={() => onPickedUpChange(true)}
                className={`w-16 ${project.pickedUp === true ? 'bg-green-100 border-green-500 ring-1 ring-green-500' : ''}`}
                aria-label="Mark as picked up"
              >
                <Check className={`mr-1 h-4 w-4 ${project.pickedUp === true ? 'text-green-600' : ''}`} /> 
                <span className={project.pickedUp === true ? 'text-green-600 font-medium' : ''}>Yes</span>
              </Toggle>
              <Toggle
                variant="outline"
                pressed={project.pickedUp === false}
                onPressedChange={() => onPickedUpChange(false)}
                className={`w-16 ${project.pickedUp === false ? 'bg-red-100 border-red-500 ring-1 ring-red-500' : ''}`}
                aria-label="Mark as not picked up"
              >
                <X className={`mr-1 h-4 w-4 ${project.pickedUp === false ? 'text-red-600' : ''}`} /> 
                <span className={project.pickedUp === false ? 'text-red-600 font-medium' : ''}>No</span>
              </Toggle>
            </div>
          ) : (
            <div className="flex items-center">
              {project.pickedUp ? (
                <span className="flex items-center text-green-600">
                  <Check className="mr-1 h-4 w-4" /> Yes
                </span>
              ) : (
                <span className="flex items-center text-red-600">
                  <X className="mr-1 h-4 w-4" /> No
                </span>
              )}
            </div>
          )}
        </div>
      )}
      
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
