
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Project } from '@/types/project';

interface ProjectPickupStatusProps {
  project: Project;
  onPickedUpChange?: (pickedUp: boolean) => void;
}

const ProjectPickupStatus = ({ project, onPickedUpChange }: ProjectPickupStatusProps) => {
  if (project.status !== 'completed') return null;

  return (
    <div className="space-y-3">
      <span className="text-muted-foreground text-sm">Pickup Status:</span>
      {onPickedUpChange ? (
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => onPickedUpChange(true)}
            className={`w-full justify-start ${project.pickedUp === true ? 'bg-green-100 border-green-500 ring-1 ring-green-500' : ''}`}
          >
            <Check className={`mr-2 h-4 w-4 ${project.pickedUp === true ? 'text-green-600' : ''}`} /> 
            <span className={project.pickedUp === true ? 'text-green-600 font-medium' : ''}>Picked up</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => onPickedUpChange(false)}
            className={`w-full justify-start ${project.pickedUp === false ? 'bg-red-100 border-red-500 ring-1 ring-red-500' : ''}`}
          >
            <X className={`mr-2 h-4 w-4 ${project.pickedUp === false ? 'text-red-600' : ''}`} /> 
            <span className={project.pickedUp === false ? 'text-red-600 font-medium' : ''}>Not picked up</span>
          </Button>
        </div>
      ) : (
        <div className="flex items-center">
          {project.pickedUp ? (
            <span className="flex items-center text-green-600">
              <Check className="mr-2 h-4 w-4" /> Picked up
            </span>
          ) : (
            <span className="flex items-center text-red-600">
              <X className="mr-2 h-4 w-4" /> Not picked up
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectPickupStatus;
