
import { Button } from '@/components/ui/button';
import { Project } from '@/types/project';

interface ProjectFormActionsProps {
  initialData?: Project;
}

export const ProjectFormActions = ({ initialData }: ProjectFormActionsProps) => {
  return (
    <div className="flex justify-end pt-2">
      <Button type="submit" className="pointer-events-auto">
        {initialData ? 'Update Project' : 'Add Project'}
      </Button>
    </div>
  );
};
