
import { PROJECT_STATUSES } from '@/utils/constants';
import { Project } from '@/types/project';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProjectStatusSelectorProps {
  project: Project;
  onStatusChange?: (status: Project['status']) => void;
}

const ProjectStatusSelector = ({ project, onStatusChange }: ProjectStatusSelectorProps) => {
  const status = PROJECT_STATUSES.find(s => s.value === project.status);

  return (
    <div className="flex justify-end space-x-2 pt-15 py-0">
      <div className="relative z-10 w-full">
        <Select defaultValue={project.status} onValueChange={value => {
          console.log("Value selected:", value);
          if (onStatusChange) {
            onStatusChange(value as Project['status']);
          }
        }}>
          <SelectTrigger className="w-full text-center justify-center border border-gray-300" style={{
            backgroundColor: status?.color || 'transparent',
            color: 'black'
          }}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="z-50 bg-white border border-gray-300 shadow-lg" position="popper">
            {PROJECT_STATUSES.map(statusOption => 
              <SelectItem key={statusOption.value} value={statusOption.value} className="capitalize cursor-pointer text-center justify-center hover:bg-gray-100" style={{
                backgroundColor: project.status === statusOption.value ? statusOption.color : undefined
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

export default ProjectStatusSelector;
