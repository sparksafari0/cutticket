
import { X } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogClose
} from "@/components/ui/dialog";
import { useEffect } from 'react';

interface ProjectImageViewProps {
  image: string | null;
  onClose: () => void;
}

const ProjectImageView = ({ image, onClose }: ProjectImageViewProps) => {
  const isPdfFile = (url: string) => {
    return /\.pdf$/i.test(url);
  };

  useEffect(() => {
    // If it's a PDF, open it in a new tab instead of showing in dialog
    if (image && isPdfFile(image)) {
      window.open(image, '_blank');
      onClose(); // Close the dialog immediately
    }
  }, [image, onClose]);

  if (!image || isPdfFile(image)) return null;
  
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
