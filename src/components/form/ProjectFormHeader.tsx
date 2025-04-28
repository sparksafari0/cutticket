
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Project } from '@/types/project';

interface ProjectFormHeaderProps {
  initialData?: Project;
}

export const ProjectFormHeader = ({ initialData }: ProjectFormHeaderProps) => {
  return (
    <DialogHeader className="px-6 pt-6">
      <DialogTitle>{initialData ? 'Edit Project' : 'Add New Project'}</DialogTitle>
      <DialogDescription>
        {initialData ? 'Edit the details of your project below.' : 'Fill in the details for your new project.'}
      </DialogDescription>
    </DialogHeader>
  );
};
