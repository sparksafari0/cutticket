import { Button } from '@/components/ui/button';
import { GenerationOptions } from '@/pages/GenerateSketch';
interface SketchGenerateButtonProps {
  uploadedImages: string[];
  fullPrompt: string;
  options: GenerationOptions;
  isGenerating: boolean;
  onGenerate: () => void;
}
export const SketchGenerateButton = ({
  uploadedImages,
  fullPrompt,
  options,
  isGenerating,
  onGenerate
}: SketchGenerateButtonProps) => {
  const canGenerate = uploadedImages.length > 0 && fullPrompt.trim() && (options.visualized || options.flatSketch);
  return <>
      <Button onClick={onGenerate} disabled={!canGenerate || isGenerating} className="h-12 px-6 sm:px-8 text-sm w-full" size="lg">
        {isGenerating ? <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Generating...
          </> : 'Generate'}
      </Button>

      {/* Validation Messages */}
      {!canGenerate && <div className="text-sm text-red-500 space-y-1">
          {!uploadedImages.length}
          {!fullPrompt.trim()}
          {!options.visualized && !options.flatSketch}
        </div>}
    </>;
};