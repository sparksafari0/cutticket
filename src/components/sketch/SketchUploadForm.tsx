
import { useState, useRef } from 'react';
import { Upload, Camera, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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

      // Check if we've reached the limit of 6 photos
      if (uploadedImages.length >= 6) {
        console.error('Maximum 6 images allowed');
        return;
      }

      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `sketch-uploads/${fileName}`;

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      // Update the uploaded images
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Upload Images Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-center">Upload images</h2>
        
        {/* Upload Area */}
        <div 
          className={`w-full h-40 bg-gray-100 border-2 border-dashed rounded-md flex items-center justify-center mb-4 transition-colors ${
            isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {uploadedImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 w-full p-4 overflow-y-auto max-h-32">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
                  <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => handleRemoveImage(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500">
              <Image className="h-10 w-10 mb-2" />
              <span className="text-center">
                {isDragOver ? 'Drop images here' : 'Drag & drop images here'}
              </span>
            </div>
          )}
        </div>

        {/* Category badges */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          <Badge variant="outline">✏️ Hand/Flat sketches</Badge>
          <Badge variant="outline">👕 Reference images</Badge>
          <Badge variant="outline">📋 Fabric swatches</Badge>
        </div>

        {/* Upload Button */}
        <div className="flex justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" disabled={uploading || uploadedImages.length >= 6}>
                {uploading ? 'Uploading...' : 'Upload images'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 bg-background">
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={triggerFileUpload}
                  disabled={uploading}
                  className="flex items-center gap-2"
                >
                  <Upload size={16} />
                  Upload Images
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={triggerCameraCapture}
                  disabled={uploading}
                  className="flex items-center gap-2"
                >
                  <Camera size={16} />
                  Take Photo
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="text-xs text-muted-foreground text-center mt-2">
          {uploading ? 'Uploading...' : `Allow uploading up to 6 photos. At least 1 photo required. (${6 - uploadedImages.length} remaining)`}
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
      </div>

      {/* Prompt Section */}
      <div className="space-y-4">
        <div className="text-center text-gray-600 italic">
          What design of clothes you want to make...?
        </div>
        
        <Textarea
          placeholder="Describe your design..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[120px] resize-none"
        />

        {/* Generation Options */}
        <div className="flex gap-4 justify-center">
          <Button
            variant={options.visualized ? "default" : "outline"}
            onClick={() => toggleOption('visualized')}
            disabled={isGenerating}
          >
            Visualized Image
          </Button>
          <Button
            variant={options.flatSketch ? "default" : "outline"}
            onClick={() => toggleOption('flatSketch')}
            disabled={isGenerating}
          >
            Flat sketch
          </Button>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!canGenerate || isGenerating}
            className="px-8"
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </Button>
        </div>

        {!canGenerate && (
          <div className="text-sm text-red-500 text-center">
            {!uploadedImages.length && "Please upload at least 1 image. "}
            {!prompt.trim() && "Prompt required. "}
            {!options.visualized && !options.flatSketch && "Please select at least one generation option."}
          </div>
        )}
      </div>
    </div>
  );
};
