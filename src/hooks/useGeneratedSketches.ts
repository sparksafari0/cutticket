
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface GeneratedSketch {
  id: string;
  original_prompt: string;
  visualized_image: string | null;
  flat_sketch_image: string | null;
  created_at: string;
  updated_at: string;
}

export function useGeneratedSketches() {
  const queryClient = useQueryClient();

  const { data: sketches = [], isLoading } = useQuery({
    queryKey: ['generated-sketches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('generated_sketches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as GeneratedSketch[];
    }
  });

  const deleteSketch = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('generated_sketches')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generated-sketches'] });
    }
  });

  return {
    sketches,
    isLoading,
    deleteSketch
  };
}
