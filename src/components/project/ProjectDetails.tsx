
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types/project';

interface ProjectDetailsProps {
  project: Project;
}

const ProjectDetails = ({ project }: ProjectDetailsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Badge variant="secondary" className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full">
        {project.type}
      </Badge>
      <Badge variant="secondary" className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full">
        {format(project.dueDate, 'MMM dd, yyyy')}
      </Badge>
    </div>
  );
};

export default ProjectDetails;
