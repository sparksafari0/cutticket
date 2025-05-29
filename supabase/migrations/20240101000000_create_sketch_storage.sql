
-- Create storage bucket for sketch uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create policy for public access to project-images bucket
CREATE POLICY "Public Access" ON storage.objects
FOR ALL USING (bucket_id = 'project-images')
WITH CHECK (bucket_id = 'project-images');
