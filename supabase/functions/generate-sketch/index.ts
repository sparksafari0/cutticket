
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

    // Generate visualized image if requested
    if (options.visualized) {
      const visualizedPrompt = `Create a highly detailed, realistic visualization of this clothing design: ${prompt}. Show it as it would look when worn, with proper lighting, textures, and professional fashion photography style.`;
      
      const formData = new FormData();
      formData.append('model', 'gpt-image-1');
      formData.append('prompt', visualizedPrompt);
      formData.append('n', '1');
      formData.append('size', '1024x1024');
      formData.append('quality', 'high');
      
      // Add images to form data
      imageBlobs.forEach((blob, index) => {
        formData.append('image[]', blob, `image_${index}.png`);
      });

      const visualizedResponse = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
        },
        body: formData,
      });

      if (!visualizedResponse.ok) {
        const errorData = await visualizedResponse.json();
        console.error('OpenAI API error for visualized image:', errorData);
        throw new Error(`OpenAI API error for visualized image: ${visualizedResponse.statusText}`);
      }

      const visualizedData = await visualizedResponse.json();
      // gpt-image-1 returns base64 data
      const base64Image = visualizedData.data[0].b64_json;
      results.visualizedImage = `data:image/png;base64,${base64Image}`;
    }

    // Generate flat sketch if requested
    if (options.flatSketch) {
      const sketchPrompt = `Create a clean, technical flat sketch of this clothing design: ${prompt}. Show it as a professional fashion flat drawing with clear lines, no shading, white background, technical illustration style.`;
      
      const formData = new FormData();
      formData.append('model', 'gpt-image-1');
      formData.append('prompt', sketchPrompt);
      formData.append('n', '1');
      formData.append('size', '1024x1024');
      formData.append('quality', 'high');
      
      // Add images to form data
      imageBlobs.forEach((blob, index) => {
        formData.append('image[]', blob, `image_${index}.png`);
      });

      const sketchResponse = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
        },
        body: formData,
      });

      if (!sketchResponse.ok) {
        const errorData = await sketchResponse.json();
        console.error('OpenAI API error for flat sketch:', errorData);
        throw new Error(`OpenAI API error for flat sketch: ${sketchResponse.statusText}`);
      }

      const sketchData = await sketchResponse.json();
      // gpt-image-1 returns base64 data
      const base64Image = sketchData.data[0].b64_json;
      results.flatSketchImage = `data:image/png;base64,${base64Image}`;
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
    }

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
