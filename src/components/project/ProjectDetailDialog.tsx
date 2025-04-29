
import { Project } from '@/types/project';
import { 
  Dialog,
  DialogContent
} from "@/components/ui/dialog";
import { useState } from 'react';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import ProjectDetailHeader from './ProjectDetailHeader';
import ProjectDetailContent from './ProjectDetailContent';

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
          <ProjectDetailHeader title={project.title} />
          <ProjectDetailContent 
            project={project} 
            onEdit={handleEdit} 
            onDelete={() => setDeleteDialogOpen(true)} 
          />
        </DialogContent>
      </Dialog>

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
