
import { DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X } from 'lucide-react';
import { Project } from '@/types/project';
import ProjectDetails from './ProjectDetails';

interface ProjectDetailHeaderProps {
  title: string;
  project: Project;
}

const ProjectDetailHeader = ({
  title,
  project
}: ProjectDetailHeaderProps) => {
  return (
    <div className="sticky top-0 left-0 right-0 bg-background z-[100] pt-4 pb-4 mb-4 border-b shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <DialogHeader className="p-0">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center gap-2">
          <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
      </div>
      
      <ProjectDetails project={project} />
    </div>
  );
};

export default ProjectDetailHeader;
