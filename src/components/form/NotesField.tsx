
import { UseFormReturn } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { FormFieldWrapper } from './FormFieldWrapper';

interface NotesFieldProps {
  form: UseFormReturn<any>;
}

export const NotesField = ({ form }: NotesFieldProps) => {
  return (
    <FormFieldWrapper 
      form={form} 
      name="notes" 
      label="Notes"
    >
      <Textarea placeholder="Add any notes here..." />
    </FormFieldWrapper>
  );
};
