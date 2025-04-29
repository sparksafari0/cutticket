
import { Project } from '@/types/project';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import ProjectCardContent from './project/ProjectCardContent';
import ProjectDetailDialog from './project/ProjectDetailDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open dialog if clicking on buttons
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      onDelete(projectToDelete);
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const actualOnDelete = (id: string) => {
    handleDeleteClick(id);
  };

  return (
    <>
      <Card className="w-full cursor-pointer" onClick={handleCardClick}>
        <ProjectCardContent 
          project={project} 
          onEdit={onEdit} 
          onDelete={actualOnDelete} 
        />
      </Card>

      <ProjectDetailDialog 
        project={project}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        onEdit={onEdit}
        onDelete={actualOnDelete}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete this project. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
