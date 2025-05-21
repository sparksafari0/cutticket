
import { Project } from '@/types/project';
import ProjectInfo from './ProjectInfo';
import ProjectImageView from './ProjectImageView';
import ReferencePhotosGrid from './ReferencePhotosGrid';
import ProjectActions from './ProjectActions';
import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

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
        <ProjectInfo project={project} onSetExpandedPhoto={setExpandedPhoto} />
        
        {expandedPhoto && (
          <ProjectImageView 
            image={expandedPhoto} 
            onClose={() => setExpandedPhoto(null)} 
          />
        )}
        
        {/* Interactive Picked Up toggles - Only show if project is completed */}
        {project.status === 'completed' && onPickedUpChange && (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Update picked up status:</h3>
            <div className="flex gap-2">
              <Toggle
                variant="outline"
                pressed={project.pickedUp === true}
                onPressedChange={() => onPickedUpChange(true)}
                className={`w-24 ${project.pickedUp === true ? 'bg-green-100' : ''}`}
              >
                <Check className="mr-1" /> Yes
              </Toggle>
              <Toggle
                variant="outline"
                pressed={project.pickedUp === false}
                onPressedChange={() => onPickedUpChange(false)}
                className={`w-24 ${project.pickedUp === false ? 'bg-red-100' : ''}`}
              >
                <X className="mr-1" /> No
              </Toggle>
            </div>
          </div>
        )}
        
        {project.referencePhotos && project.referencePhotos.length > 0 && (
          <div className="mt-4">
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
