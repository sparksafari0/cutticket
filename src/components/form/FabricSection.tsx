
import { useState, useRef } from 'react';
import { Plus, Upload, Camera, Image } from 'lucide-react';
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

interface FabricSectionProps {
  form: UseFormReturn<ProjectFormValues>;
}

type FabricType = 'self' | 'combo1' | 'combo2' | 'lining';

const fabricLabels = {
  self: 'Self',
  combo1: 'Combo 1',
  combo2: 'Combo 2',
  lining: 'Lining'
};

export const FabricSection = ({ form }: FabricSectionProps) => {
  const [uploading, setUploading] = useState<Record<FabricType, boolean>>({
    self: false,
    combo1: false,
    combo2: false,
    lining: false
  });
  
  const fileInputRefs = useRef<Record<FabricType, HTMLInputElement | null>>({
    self: null,
    combo1: null,
    combo2: null,
    lining: null
  });
  
  const cameraInputRefs = useRef<Record<FabricType, HTMLInputElement | null>>({
    self: null,
    combo1: null,
    combo2: null,
    lining: null
  });

  const handlePhotoUpload = async (file: File, fabricType: FabricType) => {
    if (!file) return;
    
    try {
      setUploading(prev => ({ ...prev, [fabricType]: true }));
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `fabric-photos/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Error uploading fabric image:', uploadError);
        return;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);
      
      // Update the form with the new photo URL
      const imageField = `fabric${fabricType.charAt(0).toUpperCase() + fabricType.slice(1)}Image` as keyof ProjectFormValues;
      form.setValue(imageField, publicUrl);
    } catch (error) {
      console.error('Error uploading fabric photo:', error);
    } finally {
      setUploading(prev => ({ ...prev, [fabricType]: false }));
    }
  };

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>, fabricType: FabricType) => {
    const file = event.target.files?.[0];
    if (file) {
      await handlePhotoUpload(file, fabricType);
    }
  };

  const triggerFileUpload = (fabricType: FabricType) => {
    fileInputRefs.current[fabricType]?.click();
  };

  const triggerCameraCapture = (fabricType: FabricType) => {
    cameraInputRefs.current[fabricType]?.click();
  };

  const renderFabricBox = (fabricType: FabricType) => {
    const imageField = `fabric${fabricType.charAt(0).toUpperCase() + fabricType.slice(1)}Image` as keyof ProjectFormValues;
    const textField = `fabric${fabricType.charAt(0).toUpperCase() + fabricType.slice(1)}Text` as keyof ProjectFormValues;
    const imageValue = form.watch(imageField) as string;
    const textValue = form.watch(textField) as string;

    return (
      <div key={fabricType} className="space-y-2">
        <FormLabel className="text-sm font-medium">{fabricLabels[fabricType]}</FormLabel>
        
        {/* Image Upload Box */}
        <div className="aspect-square bg-gray-100 rounded-md border-2 border-dashed border-gray-200 overflow-hidden">
          {imageValue ? (
            <img 
              src={imageValue} 
              alt={`${fabricLabels[fabricType]} fabric`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-10 w-10"
                    disabled={uploading[fabricType]}
                  >
                    <Plus className="h-6 w-6 text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2 bg-background">
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => triggerFileUpload(fabricType)}
                      disabled={uploading[fabricType]}
                      className="flex items-center gap-2"
                    >
                      <Upload size={16} />
                      Upload Photo
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => triggerCameraCapture(fabricType)}
                      disabled={uploading[fabricType]}
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

        {/* Text Input */}
        <FormField
          control={form.control}
          name={textField}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  placeholder="Other (e.g., blue cotton)" 
                  {...field}
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
          ref={(el) => fileInputRefs.current[fabricType] = el}
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileInputChange(e, fabricType)}
          disabled={uploading[fabricType]}
        />
        <input
          type="file"
          ref={(el) => cameraInputRefs.current[fabricType] = el}
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFileInputChange(e, fabricType)}
          disabled={uploading[fabricType]}
        />

        {/* Hidden form fields for the image URLs */}
        <FormField
          control={form.control}
          name={imageField}
          render={({ field }) => (
            <input type="hidden" {...field} />
          )}
        />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <FormLabel className="text-base font-medium">Fabric (Optional)</FormLabel>
      <div className="grid grid-cols-4 gap-4">
        {(Object.keys(fabricLabels) as FabricType[]).map(fabricType => renderFabricBox(fabricType))}
      </div>
    </div>
  );
};
