
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
import { useEffect } from 'react';

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Project>) => void;
  initialData?: Project;
}

export const ProjectForm = ({ open, onOpenChange, onSubmit, initialData }: ProjectFormProps) => {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: '',
      type: 'productions',
      status: 'not_started',
      notes: '',
      dueDate: new Date(),
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
      });
    } else if (!initialData && open) {
      // Reset to defaults when adding new project
      form.reset({
        title: '',
        type: 'productions',
        status: 'not_started',
        notes: '',
        dueDate: new Date(),
      });
    }
  }, [initialData, open, form]);

  const handleFormSubmit = (data: ProjectFormValues) => {
    console.log("Form submitted with data:", data);
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Edit the details of your project below.' : 'Fill in the details for your new project.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
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
            <div className="flex justify-end pt-2">
              <Button type="submit" className="pointer-events-auto">
                {initialData ? 'Update Project' : 'Add Project'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
