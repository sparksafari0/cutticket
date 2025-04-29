
import { DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROJECT_STATUSES } from "@/utils/constants";
import { ProjectStatus } from "@/types/project";

interface ProjectDetailHeaderProps {
  title: string;
  status: ProjectStatus;
  onStatusChange?: (status: ProjectStatus) => void;
}

const ProjectDetailHeader = ({ 
  title, 
  status, 
  onStatusChange 
}: ProjectDetailHeaderProps) => {
  const currentStatus = PROJECT_STATUSES.find(s => s.value === status);
  
  return (
    <div className="fixed top-0 right-0 left-0 bg-background z-10 pt-6 pb-2 px-6 flex items-center justify-between">
      <DialogHeader className="p-0">
        <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
      </DialogHeader>
      
      <div className="flex items-center gap-2">
        <Select
          value={status}
          onValueChange={(value) => onStatusChange?.(value as ProjectStatus)}
        >
          <SelectTrigger 
            className="w-[130px]"
            style={{ backgroundColor: currentStatus?.color }}
          >
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {PROJECT_STATUSES.map((statusOption) => (
              <SelectItem 
                key={statusOption.value} 
                value={statusOption.value}
                className="capitalize"
                style={{
                  backgroundColor: status === statusOption.value ? statusOption.color : undefined
                }}
              >
                {statusOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </div>
    </div>
  );
};

export default ProjectDetailHeader;
