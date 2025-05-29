import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { GenerationResult } from '@/pages/GenerateSketch';
interface SketchResultsProps {
  results: GenerationResult;
  onStartOver: () => void;
  isGenerating: boolean;
}
export const SketchResults = ({
  results,
  onStartOver,
  isGenerating
}: SketchResultsProps) => {
  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  if (isGenerating) {
    return <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-lg font-medium">Generating your sketches...</p>
        <p className="text-sm text-gray-500">This may take a few moments</p>
      </div>;
  }
  return <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Generated Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Original Prompt:</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                {results.originalPrompt}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.visualizedImage && <div className="space-y-2">
                  <h4 className="font-medium text-sm">Visualized Image</h4>
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                    <img src={results.visualizedImage} alt="Visualized" className="w-full h-full object-cover" />
                    <Button size="icon" variant="secondary" className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8" onClick={() => downloadImage(results.visualizedImage!, 'visualized-image.png')}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>}
              
              {results.flatSketchImage && <div className="space-y-2">
                  <h4 className="font-medium text-sm">Flat Sketch</h4>
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                    <img src={results.flatSketchImage} alt="Flat Sketch" className="w-full h-full object-cover" />
                    <Button size="icon" variant="secondary" className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8" onClick={() => downloadImage(results.flatSketchImage!, 'flat-sketch.png')}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};