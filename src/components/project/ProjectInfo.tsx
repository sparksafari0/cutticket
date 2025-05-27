
import { Project } from '@/types/project';
import ProjectImageDisplay from './ProjectImageDisplay';
import ProjectStatusSelector from './ProjectStatusSelector';
import ProjectPickupStatus from './ProjectPickupStatus';
import ProjectDaysLeft from './ProjectDaysLeft';
import ProjectNotes from './ProjectNotes';
import ProjectActionButtons from './ProjectActionButtons';
import ProjectFabricDisplay from './ProjectFabricDisplay';

interface ProjectInfoProps {
  project: Project;
  onSetExpandedPhoto: (photo: string) => void;
  onPickedUpChange?: (pickedUp: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange?: (status: Project['status']) => void;
  onClose?: () => void;
}

const ProjectInfo = ({ 
  project, 
  onSetExpandedPhoto, 
  onPickedUpChange,
  onEdit,
  onDelete,
  onStatusChange,
  onClose
}: ProjectInfoProps) => {
  return (
    <div className="space-y-4">
      <ProjectDaysLeft project={project} />
      
      <div className="-mt-2">
        <ProjectStatusSelector project={project} onStatusChange={onStatusChange} />
      </div>
      
      <ProjectPickupStatus project={project} onPickedUpChange={onPickedUpChange} />
      
      <ProjectImageDisplay project={project} onSetExpandedPhoto={onSetExpandedPhoto} />
      
      <ProjectFabricDisplay project={project} onSetExpandedPhoto={onSetExpandedPhoto} />
      
      <ProjectNotes project={project} />

      <div className="h-16"></div>
      <ProjectActionButtons onEdit={onEdit} onClose={onClose} />
    </div>
  );
};

export default ProjectInfo;
