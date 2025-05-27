
import { FormLabel } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from '@/schemas/projectSchema';
import { FabricBox } from './FabricBox';
import { FabricType, fabricLabels } from '@/utils/fabricTypes';

interface FabricSectionProps {
  form: UseFormReturn<ProjectFormValues>;
}

export const FabricSection = ({
  form
}: FabricSectionProps) => {
  const fabricTypes = Object.keys(fabricLabels) as FabricType[];
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4 p-2 border-2 border-dashed border-gray-200 rounded-md">
        {fabricTypes.map(fabricType => <FabricBox key={fabricType} form={form} fabricType={fabricType} />)}
      </div>
    </div>
  );
};
