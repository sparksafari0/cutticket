
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types/project';

interface ProjectDetailsProps {
  project: Project;
}

const ProjectDetails = ({ project }: ProjectDetailsProps) => {
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Badge variant="secondary" className="text-sm px-3 py-1 bg-gray-200 text-gray-700 rounded-full font-medium">
        {capitalizeFirstLetter(project.type)}
      </Badge>
      <Badge variant="secondary" className="text-sm px-3 py-1 bg-gray-200 text-gray-700 rounded-full font-medium">
        {format(project.dueDate, 'MMM dd, yyyy')}
      </Badge>
      {project.styleNumber && (
        <Badge variant="secondary" className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
          {project.styleNumber}
        </Badge>
      )}
    </div>
  );
};

export default ProjectDetails;
