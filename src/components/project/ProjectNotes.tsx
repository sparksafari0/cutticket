
import { Project } from '@/types/project';

interface ProjectNotesProps {
  project: Project;
}

const ProjectNotes = ({ project }: ProjectNotesProps) => {
  if (!project.notes) return null;

  return (
    <div className="space-y-2 mb-6">
      <h3 className="font-medium">Notes:</h3>
      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
        <p className="whitespace-pre-wrap">{project.notes}</p>
      </div>
    </div>
  );
};

export default ProjectNotes;
