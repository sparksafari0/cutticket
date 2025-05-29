import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SketchUploadForm } from '@/components/sketch/SketchUploadForm';
import { SketchResults } from '@/components/sketch/SketchResults';
import { SketchGallery } from '@/components/sketch/SketchGallery';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { GeneratedSketch, useGeneratedSketches } from '@/hooks/useGeneratedSketches';
import DeleteConfirmationDialog from '@/components/project/DeleteConfirmationDialog';
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
  id?: string;
  visualizedImage?: string;
  flatSketchImage?: string;
  originalPrompt: string;
}
const GenerateSketch = () => {
  const [results, setResults] = useState<GenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const {
    deleteSketch
  } = useGeneratedSketches();
  const handleGenerate = async (request: GenerationRequest) => {
    setIsGenerating(true);
    try {
      // Call the Supabase Edge Function
      const {
        data,
        error
      } = await supabase.functions.invoke('generate-sketch', {
        body: request
      });
      if (error) {
        console.error('Error generating images:', error);
        toast.error('Failed to generate images. Please try again.');
        return;
      }
      setResults(data);
      setShowForm(false);
      toast.success('Images generated successfully!');
    } catch (error) {
      console.error('Error generating images:', error);
      toast.error('Failed to generate images. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  const handleStartOver = () => {
    setResults(null);
    setShowForm(false);
  };
  const handleNewSketch = () => {
    setResults(null);
    setShowForm(true);
  };
  const handleSketchClick = (sketch: GeneratedSketch) => {
    setResults({
      id: sketch.id,
      originalPrompt: sketch.original_prompt,
      visualizedImage: sketch.visualized_image || undefined,
      flatSketchImage: sketch.flat_sketch_image || undefined
    });
    setShowForm(false);
  };
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = async () => {
    if (!results?.id) return;
    try {
      await deleteSketch.mutateAsync(results.id);
      toast.success('Sketch deleted successfully');
      handleStartOver();
    } catch (error) {
      toast.error('Failed to delete sketch');
    } finally {
      setDeleteDialogOpen(false);
    }
  };
  return <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold">Sketch Generator</h1>
          </div>
          
          {!showForm && !results && <Button onClick={handleNewSketch} className="w-full sm:w-auto text-sm">
              <Plus className="h-4 w-4 mr-2" />
              Generate New Sketch
            </Button>}
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {results ? <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={handleStartOver} className="text-sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Gallery
                  </Button>
                  <Button variant="outline" onClick={handleNewSketch} className="text-sm bg-slate-900 hover:bg-slate-800 text-slate-50">
                    Generate New
                  </Button>
                </div>
                
                {results.id}
              </div>
              <SketchResults results={results} onStartOver={handleStartOver} isGenerating={isGenerating} />
            </div> : showForm ? <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h2 className="text-lg sm:text-xl font-semibold">Generate New Sketch</h2>
                <Button variant="outline" onClick={handleStartOver} className="text-sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Gallery
                </Button>
              </div>
              <SketchUploadForm onGenerate={handleGenerate} isGenerating={isGenerating} />
            </div> : <div className="space-y-6">
              <SketchGallery onSketchClick={handleSketchClick} />
            </div>}
        </div>

        <DeleteConfirmationDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} onConfirm={handleDeleteConfirm} title={results?.originalPrompt || 'this sketch'} />
      </div>
    </div>;
};
export default GenerateSketch;