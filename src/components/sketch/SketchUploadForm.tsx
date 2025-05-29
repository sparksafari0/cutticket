
import { useState, useRef } from 'react';
import { Upload, Camera, Image, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { supabase } from '@/integrations/supabase/client';
import { GenerationRequest, GenerationOptions } from '@/pages/GenerateSketch';

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
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    try {
      setUploading(true);
      
      if (uploadedImages.length >= 6) {
        console.error('Maximum 6 images allowed');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `sketch-uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      setUploadedImages(prev => [...prev, publicUrl]);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleMultipleImageUpload = async (files: File[]) => {
    const maxImagesToUpload = Math.min(files.length, 6 - uploadedImages.length);
    
    if (maxImagesToUpload <= 0) {
      console.error('Maximum 6 images allowed');
      return;
    }

    setUploading(true);
    
    try {
      const uploadPromises = files.slice(0, maxImagesToUpload).map(async (file) => {
        if (!file.type.startsWith('image/')) return null;
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `sketch-uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          return null;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const successfulUploads = uploadedUrls.filter(url => url !== null);
      
      if (successfulUploads.length > 0) {
        setUploadedImages(prev => [...prev, ...successfulUploads]);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      if (files.length === 1) {
        await handleImageUpload(files[0]);
      } else {
        await handleMultipleImageUpload(Array.from(files));
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      if (imageFiles.length === 1) {
        await handleImageUpload(imageFiles[0]);
      } else {
        await handleMultipleImageUpload(imageFiles);
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const triggerCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const toggleOption = (option: keyof GenerationOptions) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFullPrompt(e.target.value);
  };

  const canGenerate = uploadedImages.length > 0 && fullPrompt.trim() && (options.visualized || options.flatSketch);

  const handleSubmit = () => {
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
          <div className="space-y-4">
            <div 
              className={`relative min-h-[180px] sm:min-h-[200px] border-2 border-dashed rounded-xl p-4 sm:p-8 transition-all cursor-pointer ${
                isDragOver 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-300 hover:border-primary/50 bg-gray-50/50'
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFileUpload}
            >
              {uploadedImages.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-base sm:text-lg font-medium mb-2">Upload images</h3>
                    <div className="flex gap-2 justify-center text-xs">
                      <span>{uploadedImages.length}/6 images uploaded</span>
                      <span>•</span>
                      <span className="text-green-600">At least 1 photo required</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-sm mx-auto">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative aspect-square bg-white rounded-lg overflow-hidden border group">
                        <img 
                          src={image} 
                          alt={`Reference ${index + 1}`} 
                          className="w-full h-full object-cover" 
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(index);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-4 sm:mb-6">
                    <Image className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 text-gray-400" />
                    <h3 className="text-base sm:text-lg font-medium mb-2">Upload images</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Drag and drop images or click to browse
                    </p>
                  </div>
                </div>
              )}
              
              {/* Upload type badges - responsive grid */}
              <div className="grid grid-cols-1 gap-2 justify-center mt-4 max-w-md mx-auto">
                <div className="flex flex-wrap justify-center gap-2">
                  <div className="flex items-center justify-center gap-2 px-2 sm:px-3 py-1 border border-dashed border-gray-300 rounded-full text-xs text-gray-600">
                    <span>✏️</span>
                    <span className="text-center">Hand/Flat sketches</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 px-2 sm:px-3 py-1 border border-dashed border-gray-300 rounded-full text-xs text-gray-600">
                    <span>👕</span>
                    <span className="text-center">Reference images</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 px-2 sm:px-3 py-1 border border-dashed border-gray-300 rounded-full text-xs text-gray-600">
                    <span>🧵</span>
                    <span className="text-center">Fabric swatches</span>
                  </div>
                </div>
              </div>
              
              {uploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm">Uploading...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Combined Prompt and Options Section - Single Box */}
          <div className="space-y-4">
            {/* Single unified card/box */}
            <div className="border border-gray-300 rounded-lg overflow-hidden max-w-xl">
              {/* Top section with "I want to make a" and checkboxes */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 py-3 bg-gray-50/50 border-b border-gray-200">
                <span className="text-base font-bold italic text-gray-500 whitespace-nowrap">I want to make a</span>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => toggleOption('visualized')}
                    disabled={isGenerating}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md transition-all ${
                      options.visualized 
                        ? 'border-primary bg-primary text-primary-foreground' 
                        : 'border-gray-300 bg-white text-gray-700 hover:border-primary/50'
                    }`}
                  >
                    <div className={`w-3 h-3 border rounded-sm flex items-center justify-center ${
                      options.visualized ? 'border-white bg-white' : 'border-gray-400'
                    }`}>
                      {options.visualized && <Check className="h-2 w-2 text-primary" />}
                    </div>
                    <span>Visualized Image</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => toggleOption('flatSketch')}
                    disabled={isGenerating}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md transition-all ${
                      options.flatSketch 
                        ? 'border-primary bg-primary text-primary-foreground' 
                        : 'border-gray-300 bg-white text-gray-700 hover:border-primary/50'
                    }`}
                  >
                    <div className={`w-3 h-3 border rounded-sm flex items-center justify-center ${
                      options.flatSketch ? 'border-white bg-white' : 'border-gray-400'
                    }`}>
                      {options.flatSketch && <Check className="h-2 w-2 text-primary" />}
                    </div>
                    <span>Flat sketch</span>
                  </button>
                </div>
              </div>
              
              {/* Bottom section - Text input area without border */}
              <div>
                <Textarea
                  value={fullPrompt}
                  onChange={handlePromptChange}
                  className="min-h-[120px] resize-none border-0 focus:ring-0 focus-visible:ring-0 text-base placeholder:text-gray-400 rounded-none"
                  placeholder="Of this jacket combined in this fabric..."
                />
              </div>
            </div>
            
            <Button
              onClick={handleSubmit}
              disabled={!canGenerate || isGenerating}
              className="h-12 px-6 sm:px-8 text-sm w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </Button>
          </div>

          {/* Validation Messages */}
          {!canGenerate && (
            <div className="text-sm text-red-500 space-y-1">
              {!uploadedImages.length && <div>• Please upload at least 1 image</div>}
              {!fullPrompt.trim() && <div>• Please describe your design</div>}
              {!options.visualized && !options.flatSketch && <div>• Please select at least one generation option</div>}
            </div>
          )}

          {/* Hidden file inputs */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileInputChange}
            disabled={uploading}
          />
          <input
            type="file"
            ref={cameraInputRef}
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileInputChange}
            disabled={uploading}
          />
        </CardContent>
      </Card>
    </div>
  );
};
