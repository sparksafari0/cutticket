
import { useState, useRef } from 'react';
import { Plus, X, Upload, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from '@/schemas/projectSchema';
import { supabase } from '@/integrations/supabase/client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ReferencePhotosFieldProps {
  form: UseFormReturn<ProjectFormValues>;
}

export const ReferencePhotosField = ({ form }: ReferencePhotosFieldProps) => {
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  // Get current reference photos from form
  const referencePhotos = form.watch('referencePhotos') || [];
  
  const handlePhotoUpload = async (file: File) => {
    if (!file) return;
    
    try {
      setUploading(true);
      
      // Check if we've reached the limit of 6 photos
      if (referencePhotos.length >= 6) {
        console.error('Maximum 6 reference photos allowed');
        return;
      }
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `reference-photos/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);
      
      // Update the form with the new photo URL in the array
      const updatedPhotos = [...referencePhotos, publicUrl];
      form.setValue('referencePhotos', updatedPhotos);
    } catch (error) {
      console.error('Error uploading reference photo:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handlePhotoUpload(file);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = [...referencePhotos];
    updatedPhotos.splice(index, 1);
    form.setValue('referencePhotos', updatedPhotos);
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
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      await handlePhotoUpload(imageFile);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const triggerCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  return (
    <FormField
      control={form.control}
      name="referencePhotos"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Reference Photos (Optional, max 6)</FormLabel>
          
          {/* Photo Grid */}
          <div 
            className={`grid grid-cols-3 md:grid-cols-4 gap-2 mb-2 p-2 border-2 border-dashed rounded-md transition-colors ${
              isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {referencePhotos.map((photo, index) => (
              <div key={index} className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
                <img 
                  src={photo} 
                  alt={`Reference ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={() => handleRemovePhoto(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            
            {/* Add Photo Placeholder - only show if under 6 photos */}
            {referencePhotos.length < 6 && (
              <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center border-2 border-dashed border-gray-200">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-10 w-10"
                      disabled={uploading}
                    >
                      <Plus className="h-6 w-6 text-gray-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2 bg-background">
                    <div className="flex flex-col gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={triggerFileUpload}
                        disabled={uploading}
                        className="flex items-center gap-2"
                      >
                        <Upload size={16} />
                        Upload Photo
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={triggerCameraCapture}
                        disabled={uploading}
                        className="flex items-center gap-2"
                      >
                        <Camera size={16} />
                        Take Photo
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
            
            {/* Drag and drop hint */}
            {referencePhotos.length === 0 && (
              <div className="col-span-full flex items-center justify-center py-4 text-gray-500 text-sm">
                {isDragOver ? 'Drop images here' : 'Drag & drop images here or use the + button'}
              </div>
            )}
          </div>
          
          {/* Hidden file inputs */}
          <input
            type="file"
            id="reference-upload"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
            disabled={uploading}
          />
          <input
            type="file"
            id="reference-camera"
            ref={cameraInputRef}
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileInputChange}
            disabled={uploading}
          />
          
          {/* Help text */}
          <div className="text-xs text-muted-foreground mt-1">
            {uploading ? 'Uploading...' : `${6 - referencePhotos.length} ${referencePhotos.length < 5 ? 'photos' : 'photo'} remaining`}
          </div>
          
          <input type="hidden" {...field} value={JSON.stringify(field.value || [])} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
