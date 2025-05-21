
import { Project } from '@/types/project';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  Form,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectFormSchema, ProjectFormValues } from '@/schemas/projectSchema';
import { DatePickerField } from './form/DatePickerField';
import { ProjectSelectFields } from './form/ProjectSelectFields';
import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImageUploadField } from './form/ImageUploadField';
import { ProjectFormHeader } from './form/ProjectFormHeader';
import { ProjectFormActions } from './form/ProjectFormActions';
import { TitleField } from './form/TitleField';
import { NotesField } from './form/NotesField';
import { ReferencePhotosField } from './form/ReferencePhotosField';

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Project>) => void;
  initialData?: Project;
}

export const ProjectForm = ({ open, onOpenChange, onSubmit, initialData }: ProjectFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: '',
      type: 'productions',
      status: 'not_started',
      notes: '',
      dueDate: new Date(),
      imageUrl: '',
      referencePhotos: [],
      pickedUp: false,
    },
  });
  
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
        referencePhotos: initialData.referencePhotos || [],
        pickedUp: initialData.pickedUp || false,
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
        referencePhotos: [],
        pickedUp: false,
      });
      setImagePreview(null);
    }
  }, [initialData, open, form]);

  const handleFormSubmit = (data: ProjectFormValues) => {
    console.log("Form submitted with data:", data);
    onSubmit(data);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0">
        <ProjectFormHeader initialData={initialData} />
        
        <ScrollArea className="px-6 pb-6 max-h-[calc(90vh-80px)]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
              <ImageUploadField 
                form={form} 
                imagePreview={imagePreview} 
                setImagePreview={setImagePreview} 
              />

              <TitleField form={form} />
              <ProjectSelectFields form={form} isEdit={!!initialData} />
              <DatePickerField form={form} />
              <NotesField form={form} />
              <ReferencePhotosField form={form} />
              
              <ProjectFormActions 
                initialData={initialData} 
                onCancel={handleCancel} 
              />
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
