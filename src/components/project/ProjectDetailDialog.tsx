import { Project } from '@/types/project';
import { 
  Dialog,
  DialogContent
} from "@/components/ui/dialog";
import { useState, useEffect } from 'react';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import ProjectDetailHeader from './ProjectDetailHeader';
import ProjectDetailContent from './ProjectDetailContent';
import { useProjects } from '@/hooks/useProjects';
import { toast } from "sonner";

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
  const [currentProject, setCurrentProject] = useState<Project>(project);
  const { updateProject } = useProjects();
  
  // Keep local state in sync with props
  useEffect(() => {
    setCurrentProject(project);
  }, [project]);
  
  const handleDelete = () => {
    setDeleteDialogOpen(false);
    setDialogOpen(false);
    onDelete(project.id);
  };

  const handleEdit = () => {
    setDialogOpen(false);
    onEdit(currentProject);
  };
  
  const handleStatusChange = (status: Project['status']) => {
    console.log("Status changing to:", status);
    updateProject.mutate({ 
      id: project.id, 
      status 
    }, {
      onSuccess: () => {
        // Update local state immediately for better UX
        setCurrentProject(prev => ({...prev, status}));
        toast.success(`Status updated to ${status.replace('_', ' ')}`);
      },
      onError: (error) => {
        console.error("Error updating status:", error);
        toast.error("Failed to update status");
      }
    });
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <ProjectDetailHeader 
            title={currentProject.title}
          />
          <ProjectDetailContent 
            project={currentProject} 
            onEdit={handleEdit} 
            onDelete={() => setDeleteDialogOpen(true)}
            onStatusChange={handleStatusChange}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title={currentProject.title}
      />
    </>
  );
};

export default ProjectDetailDialog;
