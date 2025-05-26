
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormFieldWrapper } from './FormFieldWrapper';

interface StyleNumberFieldProps {
  form: UseFormReturn<any>;
}

export const StyleNumberField = ({ form }: StyleNumberFieldProps) => {
  return (
    <FormFieldWrapper 
      form={form} 
      name="styleNumber" 
      label="Style #"
    >
      <Input placeholder="Enter style number" />
    </FormFieldWrapper>
  );
};
