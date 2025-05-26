
import { Image } from 'lucide-react';
import { Project } from '@/types/project';
import ReferencePhotosGrid from './ReferencePhotosGrid';

interface ProjectImageDisplayProps {
  project: Project;
  onSetExpandedPhoto: (photo: string) => void;
}

const ProjectImageDisplay = ({ project, onSetExpandedPhoto }: ProjectImageDisplayProps) => {
  return (
    <>
      {/* Main Image */}
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
      
      {/* Reference Photos */}
      {project.referencePhotos && project.referencePhotos.length > 0 && (
        <div className="mt-2">
          <ReferencePhotosGrid 
            photos={project.referencePhotos} 
            onPhotoClick={onSetExpandedPhoto} 
          />
        </div>
      )}
    </>
  );
};

export default ProjectImageDisplay;
