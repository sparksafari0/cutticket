
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormFieldWrapper } from './FormFieldWrapper';

interface TitleFieldProps {
  form: UseFormReturn<any>;
}

export const TitleField = ({ form }: TitleFieldProps) => {
  return (
    <FormFieldWrapper 
      form={form} 
      name="title" 
      label="Title"
    >
      <Input placeholder="Project title" />
    </FormFieldWrapper>
  );
};
