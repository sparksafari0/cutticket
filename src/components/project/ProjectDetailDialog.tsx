
import { Project } from '@/types/project';
import { 
  Dialog,
  DialogContent
} from "@/components/ui/dialog";
import { useState } from 'react';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import ProjectDetailHeader from './ProjectDetailHeader';
import ProjectDetailContent from './ProjectDetailContent';
import { useProjects } from '@/hooks/useProjects';

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
  const { updateProject } = useProjects();
  
  const handleDelete = () => {
    setDeleteDialogOpen(false);
    setDialogOpen(false);
    onDelete(project.id);
  };

  const handleEdit = () => {
    setDialogOpen(false);
    onEdit(project);
  };
  
  const handleStatusChange = (status: typeof project.status) => {
    updateProject.mutate({ 
      id: project.id, 
      status 
    });
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <ProjectDetailHeader 
            title={project.title} 
            status={project.status}
            onStatusChange={handleStatusChange}
          />
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
