
import { DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X } from 'lucide-react';

interface ProjectDetailHeaderProps {
  title: string;
}

const ProjectDetailHeader = ({ 
  title
}: ProjectDetailHeaderProps) => {
  
  return (
    <div className="fixed top-0 right-0 left-0 bg-background/95 backdrop-blur-sm border-b z-50 pt-6 pb-2 px-6 flex items-center justify-between">
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
  );
};

export default ProjectDetailHeader;
