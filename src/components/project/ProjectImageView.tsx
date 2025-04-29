
import { X } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogClose
} from "@/components/ui/dialog";

interface ProjectImageViewProps {
  image: string | null;
  onClose: () => void;
}

const ProjectImageView = ({ image, onClose }: ProjectImageViewProps) => {
  if (!image) return null;
  
  return (
    <Dialog open={!!image} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0">
        <div className="p-1 relative">
          <img
            src={image}
            alt="Project image"
            className="w-full h-auto object-contain max-h-[80vh]"
          />
          <DialogClose className="absolute top-2 right-2 rounded-full bg-background/80 p-1">
            <X className="h-4 w-4" />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectImageView;
