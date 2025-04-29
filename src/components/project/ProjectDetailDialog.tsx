
import { Project } from '@/types/project';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { useState } from 'react';
import { X } from 'lucide-react';
import ProjectImageView from './ProjectImageView';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import ProjectInfo from './ProjectInfo';
import ReferencePhotosGrid from './ReferencePhotosGrid';
import ProjectActions from './ProjectActions';

interface ProjectDetailDialogProps {
  project: Project;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectDetailDialog = ({ 
  project, 
  dialogOpen, 
  setDialogOpen, 
  onEdit, 
  onDelete 
}: ProjectDetailDialogProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);
  
  const handleDelete = () => {
    setDeleteDialogOpen(false);
    setDialogOpen(false);
    onDelete(project.id);
  };

  const handleEdit = () => {
    setDialogOpen(false);
    onEdit(project);
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <div className="fixed top-0 right-0 left-0 bg-background z-10 pt-6 pb-2 px-6 flex items-center justify-between">
            <DialogHeader className="p-0">
              <DialogTitle className="text-xl font-semibold">{project.title}</DialogTitle>
            </DialogHeader>
            <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
          
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
              onEdit={handleEdit} 
              onDelete={() => setDeleteDialogOpen(true)} 
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Photo Expanded View Dialog */}
      <ProjectImageView 
        image={expandedPhoto} 
        onClose={() => setExpandedPhoto(null)} 
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title={project.title}
      />
    </>
  );
};

export default ProjectDetailDialog;
