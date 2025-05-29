
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { GenerationResult } from '@/pages/GenerateSketch';
import { useState } from 'react';

interface SketchResultsProps {
  results: GenerationResult;
  onStartOver: () => void;
  isGenerating: boolean;
}

export const SketchResults = ({ results, onStartOver, isGenerating }: SketchResultsProps) => {
  const [editablePrompt, setEditablePrompt] = useState(results.originalPrompt);

  const handleEditAndCreateAgain = (type: 'visualized' | 'flatSketch') => {
    // This would trigger a new generation with the edited prompt
    console.log(`Regenerating ${type} with prompt:`, editablePrompt);
    // You can implement this functionality later
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">
          {window.innerWidth >= 768 ? 'DESKTOP VIEW RESULTS' : 'MOBILE VIEW RESULTS'}
        </h2>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-2 gap-6">
        {/* Visualized Image Result */}
        {results.visualizedImage && (
          <div className="space-y-4">
            <div className="aspect-square border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={results.visualizedImage} 
                alt="Visualized Image" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-center text-gray-600 font-medium">
              VISUALIZED IMAGE<br />
              (if user selected this option)
            </div>
            <Textarea
              value={editablePrompt}
              onChange={(e) => setEditablePrompt(e.target.value)}
              placeholder="Original description/prompt text that you can edit and type..."
              className="min-h-[80px] resize-none"
            />
            <Button 
              onClick={() => handleEditAndCreateAgain('visualized')}
              className="w-full"
              variant="secondary"
            >
              Edit & Create Again
            </Button>
          </div>
        )}

        {/* Flat Sketch Result */}
        {results.flatSketchImage && (
          <div className="space-y-4">
            <div className="aspect-square border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              {results.flatSketchImage ? (
                <img 
                  src={results.flatSketchImage} 
                  alt="Flat Sketch" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <div className="text-sm">FLAT SKETCH IMAGE</div>
                  <div className="text-xs">(if user selected this option)</div>
                  <Button className="mt-4">Create</Button>
                </div>
              )}
            </div>
            <div className="text-center text-gray-600 font-medium">
              FLAT SKETCH IMAGE<br />
              (if user selected this option)
            </div>
            <Textarea
              value={editablePrompt}
              onChange={(e) => setEditablePrompt(e.target.value)}
              placeholder="Original description/prompt text that you can edit and type..."
              className="min-h-[80px] resize-none"
            />
            <Button 
              onClick={() => handleEditAndCreateAgain('flatSketch')}
              className="w-full"
              variant="secondary"
            >
              Edit & Create Again
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-8">
        {/* Visualized Image Result */}
        {results.visualizedImage && (
          <div className="space-y-4">
            <div className="aspect-square border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={results.visualizedImage} 
                alt="Visualized Image" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-center text-gray-600 font-medium">
              VISUALIZED IMAGE<br />
              (if user selected this option)
            </div>
            <Textarea
              value={editablePrompt}
              onChange={(e) => setEditablePrompt(e.target.value)}
              placeholder="Original description/prompt text that you can edit and type..."
              className="min-h-[80px] resize-none"
            />
            <Button 
              onClick={() => handleEditAndCreateAgain('visualized')}
              className="w-full"
              variant="secondary"
            >
              Edit & Create Again
            </Button>
          </div>
        )}

        {/* Separator for mobile */}
        {results.visualizedImage && results.flatSketchImage && (
          <div className="border-t border-gray-300"></div>
        )}

        {/* Flat Sketch Result */}
        {results.flatSketchImage && (
          <div className="space-y-4">
            <div className="aspect-square border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              {results.flatSketchImage ? (
                <img 
                  src={results.flatSketchImage} 
                  alt="Flat Sketch" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <div className="text-sm">FLAT SKETCH IMAGE</div>
                  <div className="text-xs">(if user selected this option)</div>
                  <Button className="mt-4">Create</Button>
                </div>
              )}
            </div>
            <div className="text-center text-gray-600 font-medium">
              FLAT SKETCH IMAGE<br />
              (if user selected this option)
            </div>
            <Textarea
              value={editablePrompt}
              onChange={(e) => setEditablePrompt(e.target.value)}
              placeholder="Original description/prompt text that you can edit and type..."
              className="min-h-[80px] resize-none"
            />
            <Button 
              onClick={() => handleEditAndCreateAgain('flatSketch')}
              className="w-full"
              variant="secondary"
            >
              Edit & Create Again
            </Button>
          </div>
        )}
      </div>

      {/* Start Over Button */}
      <div className="flex justify-center pt-6 border-t">
        <Button onClick={onStartOver} variant="outline">
          Start Over
        </Button>
      </div>
    </div>
  );
};
