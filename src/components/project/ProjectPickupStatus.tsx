
import { Check, X } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Project } from '@/types/project';

interface ProjectPickupStatusProps {
  project: Project;
  onPickedUpChange?: (pickedUp: boolean) => void;
}

const ProjectPickupStatus = ({ project, onPickedUpChange }: ProjectPickupStatusProps) => {
  if (project.status !== 'completed') return null;

  return (
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
  );
};

export default ProjectPickupStatus;
