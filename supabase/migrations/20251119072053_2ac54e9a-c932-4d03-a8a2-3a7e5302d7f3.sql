-- Create storage bucket for blog/CMS images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cms-images',
  'cms-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- RLS Policies for cms-images bucket
-- Allow authenticated users to view all images
CREATE POLICY "Anyone can view CMS images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'cms-images');

-- Allow admins to upload images
CREATE POLICY "Admins can upload CMS images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'cms-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow admins to update their uploaded images
CREATE POLICY "Admins can update their CMS images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'cms-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow admins to delete their uploaded images
CREATE POLICY "Admins can delete their CMS images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'cms-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);