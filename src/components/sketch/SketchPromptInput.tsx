import { Check } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { GenerationOptions } from '@/pages/GenerateSketch';
interface SketchPromptInputProps {
  fullPrompt: string;
  setFullPrompt: (value: string) => void;
  options: GenerationOptions;
  setOptions: React.Dispatch<React.SetStateAction<GenerationOptions>>;
  disabled?: boolean;
}
export const SketchPromptInput = ({
  fullPrompt,
  setFullPrompt,
  options,
  setOptions,
  disabled = false
}: SketchPromptInputProps) => {
  const toggleOption = (option: keyof GenerationOptions) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFullPrompt(e.target.value);
  };
  return <div className="space-y-4">
      {/* Single unified card/box */}
      <div className="border border-gray-300 rounded-lg overflow-hidden w-full">
        {/* Top section with "I want to make a" and checkboxes */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 py-3 bg-gray-50/50 border-b border-gray-200">
          <span className="text-base font-bold italic whitespace-nowrap text-red-500">I want to make a</span>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button type="button" onClick={() => toggleOption('visualized')} disabled={disabled} className={`flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md transition-all ${options.visualized ? 'border-primary bg-primary text-primary-foreground' : 'border-gray-300 bg-white text-gray-700 hover:border-primary/50'}`}>
              <div className={`w-3 h-3 border rounded-sm flex items-center justify-center ${options.visualized ? 'border-white bg-white' : 'border-gray-400'}`}>
                {options.visualized && <Check className="h-2 w-2 text-primary" />}
              </div>
              <span>Visualized Image</span>
            </button>
            
            <button type="button" onClick={() => toggleOption('flatSketch')} disabled={disabled} className={`flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md transition-all ${options.flatSketch ? 'border-primary bg-primary text-primary-foreground' : 'border-gray-300 bg-white text-gray-700 hover:border-primary/50'}`}>
              <div className={`w-3 h-3 border rounded-sm flex items-center justify-center ${options.flatSketch ? 'border-white bg-white' : 'border-gray-400'}`}>
                {options.flatSketch && <Check className="h-2 w-2 text-primary" />}
              </div>
              <span>Flat sketch</span>
            </button>
          </div>
        </div>
        
        {/* Bottom section - Text input area without border */}
        <div>
          <Textarea value={fullPrompt} onChange={handlePromptChange} className="min-h-[120px] resize-none border-0 focus:ring-0 focus-visible:ring-0 text-base placeholder:text-gray-400 rounded-none" placeholder="Of this jacket combined in this fabric..." disabled={disabled} />
        </div>
      </div>
    </div>;
};