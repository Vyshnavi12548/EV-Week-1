-- Create storage bucket for datasets
INSERT INTO storage.buckets (id, name, public)
VALUES ('datasets', 'datasets', false)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for datasets bucket
CREATE POLICY "Users can upload their own datasets"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'datasets' AND auth.uid() IS NULL);

CREATE POLICY "Users can read their own datasets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'datasets');

CREATE POLICY "Public can read datasets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'datasets');