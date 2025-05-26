
import { DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X } from 'lucide-react';

interface ProjectDetailHeaderProps {
  title: string;
}

const ProjectDetailHeader = ({ 
  title
}: ProjectDetailHeaderProps) => {
  
  return (
    <div className="sticky top-0 z-10 bg-white border-b pt-6 pb-4 px-6 flex items-center justify-between">
      <DialogHeader className="p-0 flex-1">
        <DialogTitle className="text-xl font-semibold text-left">{title}</DialogTitle>
      </DialogHeader>
      
      <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogClose>
    </div>
  );
};

export default ProjectDetailHeader;
