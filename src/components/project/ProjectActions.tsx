
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROJECT_STATUSES } from "@/utils/constants";
import { ProjectStatus } from "@/types/project";

interface ProjectActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  status: ProjectStatus;
  onStatusChange?: (status: ProjectStatus) => void;
}

const ProjectActions = ({ 
  onEdit, 
  onDelete, 
  status, 
  onStatusChange 
}: ProjectActionsProps) => {
  const currentStatus = PROJECT_STATUSES.find(s => s.value === status);
  
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button 
        variant="outline" 
        onClick={onEdit}
      >
        <Edit className="mr-2 h-4 w-4" />
        Edit
      </Button>
      
      <div className="z-50">
        <Select
          value={status}
          onValueChange={(value) => {
            if (onStatusChange) {
              onStatusChange(value as ProjectStatus);
            }
          }}
        >
          <SelectTrigger 
            className="w-[130px]"
            style={{ 
              backgroundColor: currentStatus?.color || 'transparent',
              color: 'black'
            }}
          >
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="z-50">
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
      </div>
      
      <Button 
        variant="destructive" 
        onClick={onDelete}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  );
};

export default ProjectActions;
