
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SketchUploadForm } from '@/components/sketch/SketchUploadForm';
import { SketchResults } from '@/components/sketch/SketchResults';

export interface GenerationOptions {
  visualized: boolean;
  flatSketch: boolean;
}

export interface GenerationRequest {
  images: string[];
  prompt: string;
  options: GenerationOptions;
}

export interface GenerationResult {
  visualizedImage?: string;
  flatSketchImage?: string;
  originalPrompt: string;
}

const GenerateSketch = () => {
  const [results, setResults] = useState<GenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (request: GenerationRequest) => {
    setIsGenerating(true);
    try {
      // Here we'll call the OpenAI API to generate images
      const response = await fetch('/api/generate-sketch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to generate images');
      }

      const result = await response.json();
      setResults(result);
    } catch (error) {
      console.error('Error generating images:', error);
      // You might want to show a toast error here
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartOver = () => {
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Generate Sketch</h1>
        </div>

        {/* Main Content */}
        {results ? (
          <SketchResults 
            results={results} 
            onStartOver={handleStartOver}
            isGenerating={isGenerating}
          />
        ) : (
          <SketchUploadForm 
            onGenerate={handleGenerate} 
            isGenerating={isGenerating}
          />
        )}
      </div>
    </div>
  );
};

export default GenerateSketch;
