import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Trash2 } from 'lucide-react';
import { GenerationResult } from '@/pages/GenerateSketch';
import { ImageModal } from './ImageModal';
interface SketchResultsProps {
  results: GenerationResult;
  onStartOver: () => void;
  isGenerating: boolean;
  onDelete?: () => void;
}
export const SketchResults = ({
  results,
  onStartOver,
  isGenerating,
  onDelete
}: SketchResultsProps) => {
  const [modalImage, setModalImage] = useState<{
    url: string;
    title: string;
  } | null>(null);
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
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">✅ Generated Results</CardTitle>
            {results.id && onDelete && <Button variant="destructive" size="icon" onClick={onDelete} className="text-red-500 bg-slate-300 hover:bg-slate-200">
                <Trash2 className="h-4 w-4" />
              </Button>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2 text-base">Original Prompt:</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                {results.originalPrompt}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.visualizedImage && <div className="space-y-2">
                  <h4 className="font-medium text-sm">Visualized Image</h4>
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group cursor-pointer" onClick={() => setModalImage({
                url: results.visualizedImage!,
                title: 'Visualized Image'
              })}>
                    <img src={results.visualizedImage} alt="Visualized" className="w-full h-full object-contain" />
                    <Button size="icon" variant="secondary" className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8" onClick={e => {
                  e.stopPropagation();
                  downloadImage(results.visualizedImage!, 'visualized-image.png');
                }}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>}
              
              {results.flatSketchImage && <div className="space-y-2">
                  <h4 className="font-medium text-sm">Flat Sketch</h4>
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group cursor-pointer" onClick={() => setModalImage({
                url: results.flatSketchImage!,
                title: 'Flat Sketch'
              })}>
                    <img src={results.flatSketchImage} alt="Flat Sketch" className="w-full h-full object-contain" />
                    <Button size="icon" variant="secondary" className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8" onClick={e => {
                  e.stopPropagation();
                  downloadImage(results.flatSketchImage!, 'flat-sketch.png');
                }}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>}
            </div>
          </div>
        </CardContent>
      </Card>

      {modalImage && <ImageModal isOpen={!!modalImage} onClose={() => setModalImage(null)} imageUrl={modalImage.url} title={modalImage.title} />}
    </div>;
};