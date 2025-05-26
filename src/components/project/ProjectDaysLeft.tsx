
import { Project } from '@/types/project';

interface ProjectDaysLeftProps {
  project: Project;
}

const ProjectDaysLeft = ({ project }: ProjectDaysLeftProps) => {
  if (project.status === 'completed') return null;

  // Calculate days left for background color
  const today = new Date();
  const daysLeft = Math.floor((project.dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Set display text and style based on days left
  let daysLeftText = '';
  let bgColor = '#F1F0FB'; // Default light purple/gray
  
  if (daysLeft < 0) {
    daysLeftText = `${Math.abs(daysLeft)} days overdue`;
    bgColor = '#FFDEE2';
  } else if (daysLeft === 0) {
    daysLeftText = 'Due today';
    bgColor = '#ea384c20';
  } else if (daysLeft === 1) {
    daysLeftText = '1 day left';
    bgColor = '#F9731620';
  } else {
    daysLeftText = `${daysLeft} days left`;
    bgColor = '#F2FCE2';
  }

  return (
    <div 
      className="px-3 py-2 rounded-md text-center font-medium"
      style={{ backgroundColor: bgColor }}
    >
      {daysLeftText}
    </div>
  );
};

export default ProjectDaysLeft;
