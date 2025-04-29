
import { Project } from '@/types/project';
import { useState } from 'react';
import ProjectInfo from './ProjectInfo';
import ReferencePhotosGrid from './ReferencePhotosGrid';
import ProjectActions from './ProjectActions';
import ProjectImageView from './ProjectImageView';

interface ProjectDetailContentProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}

const ProjectDetailContent = ({ project, onEdit, onDelete }: ProjectDetailContentProps) => {
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);

  return (
    <>
      <div className="space-y-4 mt-12">
        <ProjectInfo 
          project={project} 
          onSetExpandedPhoto={setExpandedPhoto} 
        />
        
        {/* Reference Photos */}
        {project.referencePhotos && project.referencePhotos.length > 0 && (
          <ReferencePhotosGrid 
            photos={project.referencePhotos} 
            onPhotoClick={setExpandedPhoto} 
          />
        )}
        
        <ProjectActions 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      </div>

      {/* Photo Expanded View Dialog */}
      <ProjectImageView 
        image={expandedPhoto} 
        onClose={() => setExpandedPhoto(null)} 
      />
    </>
  );
};

export default ProjectDetailContent;
