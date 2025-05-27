
import { Image, FileText } from 'lucide-react';
import { Project } from '@/types/project';
import ReferencePhotosGrid from './ReferencePhotosGrid';

interface ProjectImageDisplayProps {
  project: Project;
  onSetExpandedPhoto: (photo: string) => void;
}

const ProjectImageDisplay = ({ project, onSetExpandedPhoto }: ProjectImageDisplayProps) => {
  const isImageFile = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  const isPdfFile = (url: string) => {
    return /\.pdf$/i.test(url);
  };

  return (
    <>
      {/* Main Image/Document */}
      {project.imageUrl ? (
        <div className="w-full h-48 sm:h-64 relative rounded-md overflow-hidden cursor-pointer" onClick={() => onSetExpandedPhoto(project.imageUrl!)}>
          {isImageFile(project.imageUrl) ? (
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full h-full object-contain"
            />
          ) : isPdfFile(project.imageUrl) ? (
            <div className="w-full h-full bg-red-50 flex flex-col items-center justify-center">
              <FileText className="h-16 w-16 text-red-600 mb-2" />
              <span className="text-red-600 font-medium">PDF Document</span>
              <span className="text-red-500 text-sm">Click to view</span>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
              <FileText className="h-16 w-16 text-gray-600 mb-2" />
              <span className="text-gray-600 font-medium">Document</span>
              <span className="text-gray-500 text-sm">Click to view</span>
            </div>
          )}
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
