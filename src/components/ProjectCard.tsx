
import { Project } from '@/types/project';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import ProjectCardContent from './project/ProjectCardContent';
import ProjectDetailDialog from './project/ProjectDetailDialog';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open dialog if clicking on buttons
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    setDialogOpen(true);
  };

  const handleEdit = (project: Project) => {
    // Close the detail dialog when opening edit form
    setDialogOpen(false);
    
    // Call the parent edit handler
    onEdit(project);
  };

  const reopenDetailDialog = () => {
    console.log("Reopening detail dialog for project:", project.id);
    setDialogOpen(true);
  };

  return (
    <>
      <Card className="w-full cursor-pointer" onClick={handleCardClick}>
        <ProjectCardContent 
          project={project} 
          onEdit={handleEdit} 
          onDelete={onDelete} 
        />
      </Card>

      <ProjectDetailDialog 
        project={project}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        onEdit={handleEdit}
        onDelete={onDelete}
      />
    </>
  );
};
