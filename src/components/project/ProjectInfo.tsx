
import { Project } from '@/types/project';
import ProjectImageDisplay from './ProjectImageDisplay';
import ProjectStatusSelector from './ProjectStatusSelector';
import ProjectDetails from './ProjectDetails';
import ProjectPickupStatus from './ProjectPickupStatus';
import ProjectDaysLeft from './ProjectDaysLeft';
import ProjectNotes from './ProjectNotes';
import ProjectActionButtons from './ProjectActionButtons';

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
      
      <ProjectImageDisplay project={project} onSetExpandedPhoto={onSetExpandedPhoto} />
      
      <ProjectStatusSelector project={project} onStatusChange={onStatusChange} />
      
      <ProjectDetails project={project} />
      
      <ProjectPickupStatus project={project} onPickedUpChange={onPickedUpChange} />
      
      <ProjectNotes project={project} />
      
      <ProjectActionButtons onEdit={onEdit} onClose={onClose} />
    </div>
  );
};

export default ProjectInfo;
