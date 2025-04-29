
interface ReferencePhotosGridProps {
  photos: string[];
  onPhotoClick: (photo: string) => void;
}

const ReferencePhotosGrid = ({ photos, onPhotoClick }: ReferencePhotosGridProps) => {
  if (!photos || photos.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <h3 className="font-medium">Reference Photos:</h3>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, index) => (
          <div 
            key={index} 
            className="aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer"
            onClick={() => onPhotoClick(photo)}
          >
            <img 
              src={photo} 
              alt={`Reference ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReferencePhotosGrid;
