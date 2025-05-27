
import { useState, useRef } from 'react';
import { Plus, X, Upload, Camera, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from '@/schemas/projectSchema';
import { supabase } from '@/integrations/supabase/client';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';

interface ReferencePhotosFieldProps {
  form: UseFormReturn<ProjectFormValues>;
}

export const ReferencePhotosField = ({ form }: ReferencePhotosFieldProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  // Get current reference photos from form
  const referencePhotos = form.watch('referencePhotos') || [];
  
  const handleFileUpload = async (file: File) => {
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
        console.error('Error uploading file:', uploadError);
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

  const { isDragOver, dragProps } = useDragAndDrop({
    onFileDrop: handleFileUpload,
    accept: ['image/*', 'application/pdf']
  });

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleFileUpload(file);
  };

  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = [...referencePhotos];
    updatedPhotos.splice(index, 1);
    form.setValue('referencePhotos', updatedPhotos);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const triggerCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const isImageFile = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  const isPdfFile = (url: string) => {
    return /\.pdf$/i.test(url);
  };

  return (
    <FormField
      control={form.control}
      name="referencePhotos"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Reference Photos/Documents (Optional, max 6)</FormLabel>
          
          {/* Drop Zone */}
          <div 
            className={`border-2 border-dashed rounded-md p-4 transition-colors ${
              isDragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300'
            }`}
            {...dragProps}
          >
            {isDragOver && (
              <div className="text-center py-4">
                <p className="text-primary font-medium">Drop file here to add to references</p>
              </div>
            )}
            
            {/* Photo Grid */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-2">
              {referencePhotos.map((photo, index) => (
                <div key={index} className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
                  {isImageFile(photo) ? (
                    <img 
                      src={photo} 
                      alt={`Reference ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  ) : isPdfFile(photo) ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-red-50">
                      <FileText className="h-8 w-8 text-red-600" />
                      <span className="text-xs text-red-600 mt-1">PDF</span>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                      <FileText className="h-8 w-8 text-gray-600" />
                      <span className="text-xs text-gray-600 mt-1">DOC</span>
                    </div>
                  )}
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
              {referencePhotos.length < 6 && !isDragOver && (
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
                          Upload File
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
            </div>
          </div>
          
          {/* Hidden file inputs */}
          <input
            type="file"
            id="reference-upload"
            ref={fileInputRef}
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handlePhotoUpload}
            disabled={uploading}
          />
          <input
            type="file"
            id="reference-camera"
            ref={cameraInputRef}
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handlePhotoUpload}
            disabled={uploading}
          />
          
          {/* Help text */}
          <div className="text-xs text-muted-foreground mt-1">
            {uploading ? 'Uploading...' : `${6 - referencePhotos.length} ${referencePhotos.length < 5 ? 'files' : 'file'} remaining`}
          </div>
          
          <input type="hidden" {...field} value={JSON.stringify(field.value || [])} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
