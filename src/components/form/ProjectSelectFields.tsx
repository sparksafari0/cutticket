
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PROJECT_TYPES, PROJECT_STATUSES } from '@/utils/constants';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from '@/schemas/projectSchema';
import { Toggle } from '@/components/ui/toggle';
import { Check, X } from 'lucide-react';

interface ProjectSelectFieldsProps {
  form: UseFormReturn<ProjectFormValues>;
  isEdit?: boolean;
}

export const ProjectSelectFields = ({ form, isEdit = false }: ProjectSelectFieldsProps) => {
  const currentStatus = form.watch('status');
  const showPickedUp = isEdit && currentStatus === 'completed';

  return (
    <>
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {PROJECT_TYPES.map((type) => (
                  <SelectItem key={type} value={type} className="capitalize">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {PROJECT_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {showPickedUp && (
        <FormField
          control={form.control}
          name="pickedUp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Picked Up</FormLabel>
              <div className="flex gap-2">
                <Toggle
                  variant="outline"
                  pressed={field.value === true}
                  onPressedChange={() => form.setValue('pickedUp', true)}
                  className={`w-24 ${field.value === true ? 'bg-green-100 border-green-500 ring-1 ring-green-500' : ''}`}
                >
                  <Check className={`mr-1 ${field.value === true ? 'text-green-600' : ''}`} /> 
                  <span className={field.value === true ? 'text-green-600 font-medium' : ''}>Yes</span>
                </Toggle>
                <Toggle
                  variant="outline"
                  pressed={field.value === false}
                  onPressedChange={() => form.setValue('pickedUp', false)}
                  className={`w-24 ${field.value === false ? 'bg-red-100 border-red-500 ring-1 ring-red-500' : ''}`}
                >
                  <X className={`mr-1 ${field.value === false ? 'text-red-600' : ''}`} /> 
                  <span className={field.value === false ? 'text-red-600 font-medium' : ''}>No</span>
                </Toggle>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};
