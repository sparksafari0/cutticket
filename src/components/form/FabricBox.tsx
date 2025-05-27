
import { useState, useRef } from 'react';
import { Plus, Upload, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { FabricType, fabricLabels, getFabricImageFieldName, getFabricTextFieldName } from '@/utils/fabricTypes';

interface FabricBoxProps {
  form: UseFormReturn<ProjectFormValues>;
  fabricType: FabricType;
}

export const FabricBox = ({ form, fabricType }: FabricBoxProps) => {
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const imageFieldName = getFabricImageFieldName(fabricType) as keyof ProjectFormValues;
  const textFieldName = getFabricTextFieldName(fabricType) as keyof ProjectFormValues;
  
  const imageValue = form.watch(imageFieldName) as string | undefined;
  const textValue = form.watch(textFieldName) as string | undefined;

  const handlePhotoUpload = async (file: File) => {
    if (!file) return;
    
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `fabric-photos/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Error uploading fabric image:', uploadError);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);
      
      form.setValue(imageFieldName, publicUrl);
    } catch (error) {
      console.error('Error uploading fabric photo:', error);
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

  const handleRemovePhoto = () => {
    form.setValue(imageFieldName, '');
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
    <div className="space-y-2">
      <FormLabel className="text-sm font-medium">{fabricLabels[fabricType]}</FormLabel>
      
      {/* Image Upload Box */}
      <div 
        className={`aspect-square bg-gray-100 rounded-md border-2 border-dashed overflow-hidden transition-colors ${
          isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {imageValue ? (
          <div className="relative w-full h-full">
            <img 
              src={imageValue} 
              alt={`${fabricLabels[fabricType]} fabric`} 
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute top-1 right-1 h-6 w-6"
              onClick={handleRemovePhoto}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {isDragOver ? (
              <div className="text-blue-500 text-sm">Drop image here</div>
            ) : (
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
            )}
          </div>
        )}
      </div>

      {/* Text Input */}
      <FormField
        control={form.control}
        name={textFieldName}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input 
                placeholder="Other (e.g., blue cotton)" 
                value={(field.value as string) || ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                className="text-sm"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={uploading}
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={uploading}
      />

      {/* Hidden form field for the image URL */}
      <FormField
        control={form.control}
        name={imageFieldName}
        render={({ field }) => (
          <input 
            type="hidden" 
            value={(field.value as string) || ''} 
            onChange={field.onChange}
            name={field.name}
          />
        )}
      />
    </div>
  );
};
