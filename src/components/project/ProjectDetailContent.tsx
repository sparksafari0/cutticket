
import { Project } from '@/types/project';
import ProjectInfo from './ProjectInfo';
import ProjectImageView from './ProjectImageView';
import ProjectActions from './ProjectActions';
import { useState } from 'react';

interface ProjectDetailContentProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange?: (status: Project['status']) => void;
  onPickedUpChange?: (pickedUp: boolean) => void;
}

const ProjectDetailContent = ({
  project,
  onEdit,
  onDelete,
  onStatusChange,
  onPickedUpChange
}: ProjectDetailContentProps) => {
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);
  
  return (
    <div className="pt-16 space-y-4">
      <div>
        <ProjectInfo 
          project={project} 
          onSetExpandedPhoto={setExpandedPhoto}
          onPickedUpChange={onPickedUpChange}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
        
        {expandedPhoto && (
          <ProjectImageView 
            image={expandedPhoto} 
            onClose={() => setExpandedPhoto(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default ProjectDetailContent;
