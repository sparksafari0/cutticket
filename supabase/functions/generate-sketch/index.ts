
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    // Generate visualized image if requested
    if (options.visualized) {
      const visualizedPrompt = `Create a highly detailed, realistic visualization of this clothing design: ${prompt}. Show it as it would look when worn, with proper lighting, textures, and professional fashion photography style.`;
      
      const visualizedResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: visualizedPrompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
        }),
      });

      if (!visualizedResponse.ok) {
        const errorData = await visualizedResponse.json();
        console.error('OpenAI API error for visualized image:', errorData);
        throw new Error(`OpenAI API error for visualized image: ${visualizedResponse.statusText}`);
      }

      const visualizedData = await visualizedResponse.json();
      results.visualizedImage = visualizedData.data[0].url;
    }

    // Generate flat sketch if requested
    if (options.flatSketch) {
      const sketchPrompt = `Create a clean, technical flat sketch of this clothing design: ${prompt}. Show it as a professional fashion flat drawing with clear lines, no shading, white background, technical illustration style.`;
      
      const sketchResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: sketchPrompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
        }),
      });

      if (!sketchResponse.ok) {
        const errorData = await sketchResponse.json();
        console.error('OpenAI API error for flat sketch:', errorData);
        throw new Error(`OpenAI API error for flat sketch: ${sketchResponse.statusText}`);
      }

      const sketchData = await sketchResponse.json();
      results.flatSketchImage = sketchData.data[0].url;
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
