import { format } from 'date-fns';
import { PROJECT_STATUSES } from '@/utils/constants';
import { Project } from '@/types/project';
interface ProjectDetailsProps {
  project: Project;
}
const ProjectDetails = ({
  project
}: ProjectDetailsProps) => {
  const status = PROJECT_STATUSES.find(s => s.value === project.status);
  return <>
      {/* Status */}
      
      
      {/* Type */}
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Type:</span>
        <span className="capitalize">{project.type}</span>
      </div>
      
      {/* Due Date */}
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Due Date:</span>
        <span>{format(project.dueDate, 'MMMM dd, yyyy')}</span>
      </div>
    </>;
};
export default ProjectDetails;