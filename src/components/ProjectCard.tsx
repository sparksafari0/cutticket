
import { format } from 'date-fns';
import { Project } from '@/types/project';
import { PROJECT_STATUSES } from '@/utils/constants';
import { cn } from '@/lib/utils';
import { Calendar, Edit, Trash2, Tag, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
  const status = PROJECT_STATUSES.find(s => s.value === project.status);

  return (
    <Card className="w-full">
      <div className="flex">
        {/* Image section on the left */}
        <div className="w-1/3 p-4 flex items-center justify-center">
          {project.imageUrl ? (
            <div className="w-full h-32 relative rounded-md overflow-hidden">
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
              <Image className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Content section on the right */}
        <div className="w-2/3">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{project.title}</h3>
              <div 
                className="px-2 py-1 rounded text-sm capitalize"
                style={{ backgroundColor: status?.color }}
              >
                {status?.label}
              </div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Tag className="mr-2 h-4 w-4" />
              <span className="capitalize">{project.type}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 py-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              Due: {format(project.dueDate, 'MMM dd, yyyy')}
            </div>
            {project.notes && (
              <p className="text-sm text-muted-foreground line-clamp-2">{project.notes}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(project)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(project.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};
