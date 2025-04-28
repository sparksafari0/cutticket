
import { Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectFormSchema, ProjectFormValues } from '@/schemas/projectSchema';
import { DatePickerField } from './form/DatePickerField';
import { ProjectSelectFields } from './form/ProjectSelectFields';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Image } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Project>) => void;
  initialData?: Project;
}

export const ProjectForm = ({ open, onOpenChange, onSubmit, initialData }: ProjectFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: '',
      type: 'productions',
      status: 'not_started',
      notes: '',
      dueDate: new Date(),
      imageUrl: '',
    },
  });
  
  // Reset form with initialData when it changes or when the dialog opens
  useEffect(() => {
    if (initialData && open) {
      console.log("Setting form values with initialData:", initialData);
      form.reset({
        title: initialData.title,
        type: initialData.type,
        status: initialData.status,
        dueDate: initialData.dueDate,
        notes: initialData.notes || '',
        imageUrl: initialData.imageUrl || '',
      });
      
      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl);
      } else {
        setImagePreview(null);
      }
    } else if (!initialData && open) {
      // Reset to defaults when adding new project
      form.reset({
        title: '',
        type: 'productions',
        status: 'not_started',
        notes: '',
        dueDate: new Date(),
        imageUrl: '',
      });
      setImagePreview(null);
    }
  }, [initialData, open, form]);

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

  const handleFormSubmit = (data: ProjectFormValues) => {
    console.log("Form submitted with data:", data);
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle>{initialData ? 'Edit Project' : 'Add New Project'}</DialogTitle>
              <DialogDescription>
                {initialData ? 'Edit the details of your project below.' : 'Fill in the details for your new project.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
                {/* Image Upload Field - First field */}
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

                {/* Title Field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Project title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <ProjectSelectFields form={form} />
                <DatePickerField form={form} />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add any notes here..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end pt-2 pb-2">
                  <Button type="submit" className="pointer-events-auto">
                    {initialData ? 'Update Project' : 'Add Project'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
