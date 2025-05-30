
import { useState, useRef } from 'react';
import { Image, Upload, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from '@/schemas/projectSchema';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ImageUploadFieldProps {
  form: UseFormReturn<ProjectFormValues>;
  imagePreview: string | null;
  setImagePreview: (url: string | null) => void;
}

export const ImageUploadField = ({
  form,
  imagePreview,
  setImagePreview
}: ImageUploadFieldProps) => {
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    try {
      setUploading(true);

      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `project-images/${fileName}`;

      // Upload the file to Supabase Storage
      const {
        error: uploadError,
        data
      } = await supabase.storage.from('project-images').upload(filePath, file);
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return;
      }

      // Get the public URL
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from('project-images').getPublicUrl(filePath);

      // Update the form
      form.setValue('imageUrl', publicUrl);
      setImagePreview(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleImageUpload(file);
    }
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
      await handleImageUpload(imageFile);
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
      name="imageUrl" 
      render={({ field }) => (
        <FormItem>
          <FormLabel>Project Image</FormLabel>
          <div className="flex flex-col items-center gap-2">
            <div 
              className={`relative w-full h-40 bg-gray-100 border-2 border-dashed rounded-md flex items-center justify-center overflow-hidden transition-colors ${
                isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Project preview" className="w-full h-full object-contain" />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <Image className="h-10 w-10 mb-2" />
                  <span className="text-center">
                    {isDragOver ? 'Drop image here' : 'No image selected'}
                    <br />
                    <span className="text-xs">Drag & drop an image here</span>
                  </span>
                </div>
              )}
            </div>
            
            {/* Hidden file inputs */}
            <input 
              type="file" 
              id="image-upload" 
              ref={fileInputRef} 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileInputChange} 
              disabled={uploading} 
            />
            <input 
              type="file" 
              id="camera-capture" 
              ref={cameraInputRef} 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
              onChange={handleFileInputChange} 
              disabled={uploading} 
            />
            
            {/* Dropdown for image options */}
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" disabled={uploading} className="w-full">
                  {uploading ? 'Uploading...' : imagePreview ? 'Change Image' : 'Add Image'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2 bg-background">
                <div className="flex flex-col gap-2">
                  <Button type="button" variant="ghost" onClick={triggerFileUpload} disabled={uploading} className="flex items-center gap-2">
                    <Upload size={16} />
                    Upload Image
                  </Button>
                  <Button type="button" variant="ghost" onClick={triggerCameraCapture} disabled={uploading} className="flex items-center gap-2">
                    <Camera size={16} />
                    Take Photo
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <input type="hidden" {...field} />
          </div>
          <FormMessage />
        </FormItem>
      )} 
    />
  );
};
