
import { Button } from '@/components/ui/button';

interface EmptyProjectStateProps {
  onCreateProject: () => void;
}

export const EmptyProjectState = ({ onCreateProject }: EmptyProjectStateProps) => {
  return (
    <div className="text-center py-8">
      <p className="text-lg text-gray-500 mb-4">No projects yet</p>
      <Button onClick={onCreateProject} variant="outline" className="pointer-events-auto">
        Create your first project
      </Button>
    </div>
  );
};
