
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { GenerationRequest, GenerationOptions } from '@/pages/GenerateSketch';
import { SketchImageUpload } from './SketchImageUpload';
import { SketchPromptInput } from './SketchPromptInput';
import { SketchGenerateButton } from './SketchGenerateButton';

interface SketchUploadFormProps {
  onGenerate: (request: GenerationRequest) => void;
  isGenerating: boolean;
}

export const SketchUploadForm = ({
  onGenerate,
  isGenerating
}: SketchUploadFormProps) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [fullPrompt, setFullPrompt] = useState('');
  const [options, setOptions] = useState<GenerationOptions>({
    visualized: false,
    flatSketch: false
  });

  const handleSubmit = () => {
    const canGenerate = uploadedImages.length > 0 && fullPrompt.trim() && (options.visualized || options.flatSketch);
    
    if (canGenerate) {
      onGenerate({
        images: uploadedImages,
        prompt: fullPrompt,
        options
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-2">
        <CardContent className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          {/* Upload Section */}
          <SketchImageUpload 
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
            disabled={isGenerating}
          />

          {/* Combined Prompt and Options Section */}
          <SketchPromptInput
            fullPrompt={fullPrompt}
            setFullPrompt={setFullPrompt}
            options={options}
            setOptions={setOptions}
            disabled={isGenerating}
          />

          {/* Generate Button and Validation */}
          <div className="space-y-4">
            <SketchGenerateButton
              uploadedImages={uploadedImages}
              fullPrompt={fullPrompt}
              options={options}
              isGenerating={isGenerating}
              onGenerate={handleSubmit}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
