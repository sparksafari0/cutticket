
import { useState } from 'react';
import { Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from '@/schemas/projectSchema';

interface ImageUploadFieldProps {
  form: UseFormReturn<ProjectFormValues>;
  imagePreview: string | null;
  setImagePreview: (url: string | null) => void;
}

export const ImageUploadField = ({ form, imagePreview, setImagePreview }: ImageUploadFieldProps) => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `project-images/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
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
      
      // Update the form
      form.setValue('imageUrl', publicUrl);
      setImagePreview(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <FormField
      control={form.control}
      name="imageUrl"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Project Image (Optional)</FormLabel>
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-full h-40 bg-gray-100 border rounded-md flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Project preview" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <Image className="h-10 w-10 mb-2" />
                  <span>No image selected</span>
                </div>
              )}
            </div>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => document.getElementById('image-upload')?.click()}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? 'Uploading...' : (imagePreview ? 'Change Image' : 'Upload Image')}
            </Button>
            <input type="hidden" {...field} />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
