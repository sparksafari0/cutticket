
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { images, prompt, options } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!images || !prompt || !options) {
      throw new Error('Missing required fields: images, prompt, and options are required');
    }

    console.log('Request received:', { 
      imagesCount: images.length, 
      prompt: prompt.substring(0, 100) + '...', 
      options 
    });

    const results: any = {
      originalPrompt: prompt
    };

    // Convert image URLs to blobs for form data
    const imageBlobs = await Promise.all(
      images.map(async (imageUrl: string) => {
        const response = await fetch(imageUrl);
        return await response.blob();
      })
    );

    console.log('Image blobs prepared:', imageBlobs.map(blob => ({ size: blob.size, type: blob.type })));

    let visualizedImageBlob: Blob | null = null;

    // Generate visualized image if requested
    if (options.visualized) {
      const visualizedPrompt = `I want to make a highly detailed, realistic photo of: ${prompt}.`;
      
      console.log('Creating visualized image with prompt:', visualizedPrompt);
      
      const formData = new FormData();
      formData.append('model', 'gpt-image-1');
      formData.append('prompt', visualizedPrompt);
      formData.append('n', '1');
      formData.append('size', '1024x1536');
      formData.append('quality', 'medium');
      
      // Add images to form data
      imageBlobs.forEach((blob, index) => {
        formData.append('image[]', blob, `image_${index}.png`);
      });

      console.log('FormData for visualized image created with size: 1024x1536');
      console.log('FormData entries:', Array.from(formData.entries()).map(([key, value]) => ({ 
        key, 
        valueType: typeof value,
        valueSize: value instanceof File ? value.size : 'N/A'
      })));

      const visualizedResponse = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
        },
        body: formData,
      });

      console.log('OpenAI API response status for visualized image:', visualizedResponse.status);

      if (!visualizedResponse.ok) {
        const errorData = await visualizedResponse.json();
        console.error('OpenAI API error for visualized image:', errorData);
        throw new Error(`OpenAI API error for visualized image: ${visualizedResponse.statusText}`);
      }

      const visualizedData = await visualizedResponse.json();
      console.log('OpenAI API response for visualized image:', {
        created: visualizedData.created,
        dataLength: visualizedData.data?.length,
        usage: visualizedData.usage,
        hasB64Json: !!visualizedData.data?.[0]?.b64_json,
        b64JsonLength: visualizedData.data?.[0]?.b64_json?.length
      });

      // gpt-image-1 returns base64 data
      const base64Image = visualizedData.data[0].b64_json;
      results.visualizedImage = `data:image/png;base64,${base64Image}`;

      console.log('Visualized image base64 length:', base64Image.length);

      // Validate image dimensions by creating a temporary image
      try {
        const binaryString = atob(base64Image);
        console.log('Base64 decoded length:', binaryString.length);
        
        // Convert base64 to blob for potential use in flat sketch
        if (options.flatSketch) {
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          visualizedImageBlob = new Blob([bytes], { type: 'image/png' });
          console.log('Visualized image blob created for flat sketch, size:', visualizedImageBlob.size);
        }
      } catch (error) {
        console.error('Error processing base64 image:', error);
      }
    }

    // Generate flat sketch if requested
    if (options.flatSketch) {
      let sketchPrompt: string;
      let imagesToUse: Blob[];

      if (options.visualized && visualizedImageBlob) {
        // If both options selected, use only the visualized image output and simplified prompt
        sketchPrompt = `Create a clean, technical flat sketch of this clothing design. Show it as a professional fashion flat drawing with clear lines, no shading, white background, technical illustration style.`;
        imagesToUse = [visualizedImageBlob];
        console.log('Using visualized image for flat sketch');
      } else {
        // If only flat sketch selected, use original images and user prompt
        sketchPrompt = `Create a clean, technical flat sketch of this clothing design: ${prompt}. Show it as a professional fashion flat drawing with clear lines, no shading, white background, technical illustration style.`;
        imagesToUse = imageBlobs;
        console.log('Using original images for flat sketch');
      }

      console.log('Creating flat sketch with prompt:', sketchPrompt);
      
      const formData = new FormData();
      formData.append('model', 'gpt-image-1');
      formData.append('prompt', sketchPrompt);
      formData.append('n', '1');
      formData.append('size', '1024x1536');
      formData.append('quality', 'medium');
      
      // Add images to form data
      imagesToUse.forEach((blob, index) => {
        formData.append('image[]', blob, `image_${index}.png`);
      });

      console.log('FormData for flat sketch created with size: 1024x1536, images count:', imagesToUse.length);
      console.log('FormData entries for flat sketch:', Array.from(formData.entries()).map(([key, value]) => ({ 
        key, 
        valueType: typeof value,
        valueSize: value instanceof File ? value.size : 'N/A'
      })));

      const sketchResponse = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
        },
        body: formData,
      });

      console.log('OpenAI API response status for flat sketch:', sketchResponse.status);

      if (!sketchResponse.ok) {
        const errorData = await sketchResponse.json();
        console.error('OpenAI API error for flat sketch:', errorData);
        throw new Error(`OpenAI API error for flat sketch: ${sketchResponse.statusText}`);
      }

      const sketchData = await sketchResponse.json();
      console.log('OpenAI API response for flat sketch:', {
        created: sketchData.created,
        dataLength: sketchData.data?.length,
        usage: sketchData.usage,
        hasB64Json: !!sketchData.data?.[0]?.b64_json,
        b64JsonLength: sketchData.data?.[0]?.b64_json?.length
      });

      // gpt-image-1 returns base64 data
      const base64Image = sketchData.data[0].b64_json;
      results.flatSketchImage = `data:image/png;base64,${base64Image}`;

      console.log('Flat sketch image base64 length:', base64Image.length);

      // Validate image dimensions
      try {
        const binaryString = atob(base64Image);
        console.log('Flat sketch base64 decoded length:', binaryString.length);
      } catch (error) {
        console.error('Error processing flat sketch base64 image:', error);
      }
    }

    // Save to database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: savedSketch, error: saveError } = await supabase
      .from('generated_sketches')
      .insert({
        original_prompt: prompt,
        visualized_image: results.visualizedImage || null,
        flat_sketch_image: results.flatSketchImage || null,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving sketch to database:', saveError);
      // Don't throw error, just log it - we still want to return the generated images
    } else {
      results.id = savedSketch.id;
      console.log('Sketch saved to database with ID:', savedSketch.id);
    }

    console.log('Returning results with:', {
      id: results.id,
      hasVisualizedImage: !!results.visualizedImage,
      hasFlatSketchImage: !!results.flatSketchImage,
      originalPrompt: results.originalPrompt.substring(0, 50) + '...'
    });

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-sketch function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
