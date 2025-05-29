
import { Project } from '@/types/project';
import ProjectImageDisplay from './ProjectImageDisplay';
import ProjectStatusSelector from './ProjectStatusSelector';
import ProjectPickupStatus from './ProjectPickupStatus';
import ProjectDaysLeft from './ProjectDaysLeft';
import ProjectNotes from './ProjectNotes';
import ProjectActionButtons from './ProjectActionButtons';
import ProjectFabricDisplay from './ProjectFabricDisplay';
import GenerateCutTicketButton from './GenerateCutTicketButton';

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
    <div className="space-y-4 py-0">
      {project.status === 'completed' ? (
        // Full width status selector for completed projects
        <div>
          <ProjectStatusSelector project={project} onStatusChange={onStatusChange} />
        </div>
      ) : (
        // Two column layout for non-completed projects
        <div className="flex gap-3">
          <div className="flex-1">
            <ProjectDaysLeft project={project} />
          </div>
          <div className="flex-1">
            <ProjectStatusSelector project={project} onStatusChange={onStatusChange} />
          </div>
        </div>
      )}
      
      <ProjectPickupStatus project={project} onPickedUpChange={onPickedUpChange} />
      
      <ProjectImageDisplay project={project} onSetExpandedPhoto={onSetExpandedPhoto} />
      
      <ProjectFabricDisplay project={project} onSetExpandedPhoto={onSetExpandedPhoto} />
      
      <ProjectNotes project={project} />
      
      <GenerateCutTicketButton project={project} />
      
      <ProjectActionButtons onEdit={onEdit} onClose={onClose} />
    </div>
  );
};

export default ProjectInfo;
