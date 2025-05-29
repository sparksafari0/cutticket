
import { useState, useRef } from 'react';
import { Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface SketchImageUploadProps {
  uploadedImages: string[];
  setUploadedImages: React.Dispatch<React.SetStateAction<string[]>>;
  disabled?: boolean;
}

export const SketchImageUpload = ({
  uploadedImages,
  setUploadedImages,
  disabled = false
}: SketchImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    try {
      setUploading(true);
      
      if (uploadedImages.length >= 6) {
        console.error('Maximum 6 images allowed');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `sketch-uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      setUploadedImages(prev => [...prev, publicUrl]);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleMultipleImageUpload = async (files: File[]) => {
    const maxImagesToUpload = Math.min(files.length, 6 - uploadedImages.length);
    
    if (maxImagesToUpload <= 0) {
      console.error('Maximum 6 images allowed');
      return;
    }

    setUploading(true);
    
    try {
      const uploadPromises = files.slice(0, maxImagesToUpload).map(async (file) => {
        if (!file.type.startsWith('image/')) return null;
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `sketch-uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          return null;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const successfulUploads = uploadedUrls.filter(url => url !== null);
      
      if (successfulUploads.length > 0) {
        setUploadedImages(prev => [...prev, ...successfulUploads]);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      if (files.length === 1) {
        await handleImageUpload(files[0]);
      } else {
        await handleMultipleImageUpload(Array.from(files));
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      if (imageFiles.length === 1) {
        await handleImageUpload(imageFiles[0]);
      } else {
        await handleMultipleImageUpload(imageFiles);
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const triggerCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div 
        className={`relative min-h-[180px] sm:min-h-[200px] border-2 border-dashed rounded-xl p-4 sm:p-8 transition-all cursor-pointer ${
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-primary/50 bg-gray-50/50'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileUpload}
      >
        {uploadedImages.length > 0 ? (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-base sm:text-lg font-medium mb-2">Upload images</h3>
              <div className="flex gap-2 justify-center text-xs">
                <span>{uploadedImages.length}/6 images uploaded</span>
                <span>•</span>
                <span className="text-green-600">At least 1 photo required</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-sm mx-auto">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative aspect-square bg-white rounded-lg overflow-hidden border group">
                  <img 
                    src={image} 
                    alt={`Reference ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 sm:mb-6">
              <Image className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 text-gray-400" />
              <h3 className="text-base sm:text-lg font-medium mb-2">Upload images</h3>
              <p className="text-sm text-gray-500 mb-4">
                Drag and drop images or click to browse
              </p>
            </div>
          </div>
        )}
        
        {/* Upload type badges - responsive grid */}
        <div className="grid grid-cols-1 gap-2 justify-center mt-4 max-w-md mx-auto">
          <div className="flex flex-wrap justify-center gap-2">
            <div className="flex items-center justify-center gap-2 px-2 sm:px-3 py-1 border border-dashed border-gray-300 rounded-full text-xs text-gray-600">
              <span>✏️</span>
              <span className="text-center">Hand/Flat sketches</span>
            </div>
            <div className="flex items-center justify-center gap-2 px-2 sm:px-3 py-1 border border-dashed border-gray-300 rounded-full text-xs text-gray-600">
              <span>👕</span>
              <span className="text-center">Reference images</span>
            </div>
            <div className="flex items-center justify-center gap-2 px-2 sm:px-3 py-1 border border-dashed border-gray-300 rounded-full text-xs text-gray-600">
              <span>🧵</span>
              <span className="text-center">Fabric swatches</span>
            </div>
          </div>
        </div>
        
        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm">Uploading...</p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
        disabled={uploading || disabled}
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={uploading || disabled}
      />
    </div>
  );
};
