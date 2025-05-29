import { useState } from 'react';
import { Trash2, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGeneratedSketches, GeneratedSketch } from '@/hooks/useGeneratedSketches';
import { toast } from 'sonner';
import { ImageModal } from './ImageModal';

interface SketchGalleryProps {
  onSketchClick?: (sketch: GeneratedSketch) => void;
}

export const SketchGallery = ({ onSketchClick }: SketchGalleryProps) => {
  const { sketches, isLoading, deleteSketch } = useGeneratedSketches();
  const [modalImage, setModalImage] = useState<{ url: string; title: string } | null>(null);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteSketch.mutateAsync(id);
      toast.success('Sketch deleted successfully');
    } catch (error) {
      toast.error('Failed to delete sketch');
    }
  };

  const downloadImage = (imageUrl: string, filename: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageClick = (imageUrl: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalImage({ url: imageUrl, title });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading sketches...</div>;
  }

  if (sketches.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No sketches generated yet.</p>
        <p className="text-sm mt-2">Generated sketches will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Generated Sketches ({sketches.length})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sketches.map((sketch) => (
          <Card 
            key={sketch.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSketchClick?.(sketch)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm line-clamp-2">{sketch.original_prompt}</CardTitle>
              <div className="flex items-center text-xs text-gray-500 gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(sketch.created_at).toLocaleDateString()}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {sketch.visualized_image && (
                  <div className="space-y-1">
                    <div className="text-xs text-gray-600">Visualized</div>
                    <div className="relative aspect-square bg-gray-100 rounded-md overflow-hidden group">
                      <img 
                        src={sketch.visualized_image} 
                        alt="Visualized" 
                        className="w-full h-full object-contain cursor-pointer"
                        onClick={(e) => handleImageClick(sketch.visualized_image!, 'Visualized Image', e)}
                      />
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                        onClick={(e) => downloadImage(sketch.visualized_image!, 'visualized-image.png', e)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
                {sketch.flat_sketch_image && (
                  <div className="space-y-1">
                    <div className="text-xs text-gray-600">Flat Sketch</div>
                    <div className="relative aspect-square bg-gray-100 rounded-md overflow-hidden group">
                      <img 
                        src={sketch.flat_sketch_image} 
                        alt="Flat Sketch" 
                        className="w-full h-full object-contain cursor-pointer"
                        onClick={(e) => handleImageClick(sketch.flat_sketch_image!, 'Flat Sketch', e)}
                      />
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                        onClick={(e) => downloadImage(sketch.flat_sketch_image!, 'flat-sketch.png', e)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleDelete(sketch.id, e)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {modalImage && (
        <ImageModal
          isOpen={!!modalImage}
          onClose={() => setModalImage(null)}
          imageUrl={modalImage.url}
          title={modalImage.title}
        />
      )}
    </div>
  );
};
