
import { Project } from '@/types/project';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectCardActionsProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectCardActions = ({ project, onEdit, onDelete }: ProjectCardActionsProps) => {
  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={(e) => {
          e.stopPropagation();
          onEdit(project);
        }}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(project.id);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  );
};

export default ProjectCardActions;
