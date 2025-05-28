import { useState, useRef } from 'react';
import { Upload, Camera, Image, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { GenerationRequest, GenerationOptions } from '@/pages/GenerateSketch';

interface SketchUploadFormProps {
  onGenerate: (request: GenerationRequest) => void;
  isGenerating: boolean;
}

export const SketchUploadForm = ({ onGenerate, isGenerating }: SketchUploadFormProps) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
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

  const canGenerate = uploadedImages.length > 0 && prompt.trim() && (options.visualized || options.flatSketch);

  const handleSubmit = () => {
    if (canGenerate) {
      onGenerate({
        images: uploadedImages,
        prompt: prompt.trim(),
        options
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        <CardContent className="space-y-6 p-0">
          {/* Upload Area */}
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2">Create Your Design</h2>
              <p className="text-sm text-muted-foreground">Upload reference images and describe your vision</p>
            </div>
            
            {/* Drag & Drop Area */}
            <div 
              className={`relative min-h-[200px] border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer ${
                isDragOver 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFileUpload}
            >
              {uploadedImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
                      <img src={image} alt={`Reference ${index + 1}`} className="w-full h-full object-cover" />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {/* Add More Button */}
                  {uploadedImages.length < 6 && (
                    <div className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center hover:border-primary/50 transition-colors">
                      <div className="text-center">
                        <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Add More</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <div className="mb-4">
                    <Image className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <h3 className="font-medium mb-2">
                      {isDragOver ? 'Drop your images here' : 'Upload reference images'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag & drop images or click to browse
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      triggerFileUpload();
                    }}>
                      <Upload className="h-4 w-4 mr-2" />
                      Browse Files
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      triggerCameraCapture();
                    }}>
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                  </div>
                </div>
              )}
              
              {uploading && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm">Uploading...</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Image Type Badges */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline" className="text-xs">✏️ Hand sketches</Badge>
              <Badge variant="outline" className="text-xs">👕 Reference images</Badge>
              <Badge variant="outline" className="text-xs">📋 Fabric swatches</Badge>
            </div>
            
            {/* Upload Status */}
            <div className="text-xs text-center text-muted-foreground">
              {uploadedImages.length > 0 
                ? `${uploadedImages.length}/6 images uploaded`
                : 'Upload up to 6 images'
              }
            </div>
          </div>

          {/* Prompt Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Describe your design</label>
              <Textarea
                placeholder="What design of clothes do you want to make...?"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>

            {/* Generation Options */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Generation options</label>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={options.visualized ? "default" : "outline"}
                  onClick={() => toggleOption('visualized')}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  Visualized Image
                </Button>
                <Button
                  type="button"
                  variant={options.flatSketch ? "default" : "outline"}
                  onClick={() => toggleOption('flatSketch')}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  Flat Sketch
                </Button>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleSubmit}
              disabled={!canGenerate || isGenerating}
              className="w-full h-12 text-base"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                'Generate Design'
              )}
            </Button>

            {/* Validation Messages */}
            {!canGenerate && (
              <div className="text-sm text-destructive text-center space-y-1">
                {!uploadedImages.length && <div>• Please upload at least 1 image</div>}
                {!prompt.trim() && <div>• Please describe your design</div>}
                {!options.visualized && !options.flatSketch && <div>• Please select at least one generation option</div>}
              </div>
            )}
          </div>

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
