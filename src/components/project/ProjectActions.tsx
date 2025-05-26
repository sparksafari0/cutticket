
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROJECT_STATUSES } from "@/utils/constants";
import { ProjectStatus } from "@/types/project";

interface ProjectActionsProps {
  onEdit: () => void;
  status: ProjectStatus;
  onStatusChange?: (status: ProjectStatus) => void;
  onClose?: () => void;
}

const ProjectActions = ({
  onEdit,
  status,
  onStatusChange,
  onClose
}: ProjectActionsProps) => {
  const currentStatus = PROJECT_STATUSES.find(s => s.value === status);
  
  return (
    <div className="flex justify-end space-x-2 pt-15 py-0">
      <div className="relative z-[100]">
        <Select defaultValue={status} onValueChange={value => {
          console.log("Value selected:", value);
          if (onStatusChange) {
            onStatusChange(value as ProjectStatus);
          }
        }}>
          <SelectTrigger className="w-[130px]" style={{
            backgroundColor: currentStatus?.color || 'transparent',
            color: 'black'
          }}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="z-[100] bg-white" position="popper">
            {PROJECT_STATUSES.map(statusOption => 
              <SelectItem key={statusOption.value} value={statusOption.value} className="capitalize cursor-pointer" style={{
                backgroundColor: status === statusOption.value ? statusOption.color : undefined
              }}>
                {statusOption.label}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProjectActions;
