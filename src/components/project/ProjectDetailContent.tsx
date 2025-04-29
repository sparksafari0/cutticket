
import { Project } from '@/types/project';
import ProjectInfo from './ProjectInfo';
import ProjectImageView from './ProjectImageView';
import ReferencePhotosGrid from './ReferencePhotosGrid';
import ProjectActions from './ProjectActions';
import { useState } from 'react';

interface ProjectDetailContentProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange?: (status: Project['status']) => void;
}

const ProjectDetailContent = ({ 
  project,
  onEdit,
  onDelete,
  onStatusChange
}: ProjectDetailContentProps) => {
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);
  
  return (
    <div className="pt-16 space-y-4">
      <div>
        <ProjectInfo 
          project={project} 
          onSetExpandedPhoto={setExpandedPhoto} 
        />
        
        {expandedPhoto && (
          <ProjectImageView 
            image={expandedPhoto} 
            onClose={() => setExpandedPhoto(null)} 
          />
        )}
        
        {project.referencePhotos && project.referencePhotos.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Reference Photos:</h3>
            <ReferencePhotosGrid 
              photos={project.referencePhotos} 
              onPhotoClick={setExpandedPhoto} 
            />
          </div>
        )}
        
        <ProjectActions 
          onEdit={onEdit} 
          onDelete={onDelete}
          status={project.status}
          onStatusChange={onStatusChange}
        />
      </div>
    </div>
  );
};

export default ProjectDetailContent;
