import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}
export const ImageModal = ({
  isOpen,
  onClose,
  imageUrl,
  title
}: ImageModalProps) => {
  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="relative">
          <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="absolute bottom-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white" onClick={() => downloadImage(imageUrl, `${title.toLowerCase().replace(' ', '-')}.png`)}>
            <Download className="h-4 w-4" />
          </Button>
          <img src={imageUrl} alt={title} className="w-full h-auto max-h-[90vh] object-contain" />
        </div>
      </DialogContent>
    </Dialog>;
};