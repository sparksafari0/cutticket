
import { FileText } from 'lucide-react';

interface ReferencePhotosGridProps {
  photos: string[];
  onPhotoClick: (photo: string) => void;
}

const ReferencePhotosGrid = ({
  photos,
  onPhotoClick
}: ReferencePhotosGridProps) => {
  if (!photos || photos.length === 0) return null;

  const isImageFile = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  const isPdfFile = (url: string) => {
    return /\.pdf$/i.test(url);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, index) => (
          <div 
            key={index} 
            className="aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer" 
            onClick={() => onPhotoClick(photo)}
          >
            {isImageFile(photo) ? (
              <img 
                src={photo} 
                alt={`Reference ${index + 1}`} 
                className="w-full h-full object-cover" 
              />
            ) : isPdfFile(photo) ? (
              <div className="w-full h-full bg-red-50 flex flex-col items-center justify-center">
                <FileText className="h-8 w-8 text-red-600" />
                <span className="text-xs text-red-600 mt-1">PDF</span>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center">
                <FileText className="h-8 w-8 text-gray-600" />
                <span className="text-xs text-gray-600 mt-1">DOC</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReferencePhotosGrid;
