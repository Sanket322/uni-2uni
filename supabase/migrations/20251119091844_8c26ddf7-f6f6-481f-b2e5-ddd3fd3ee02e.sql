-- Create post reports table for user reporting
CREATE TABLE IF NOT EXISTS public.post_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.post_reports ENABLE ROW LEVEL SECURITY;

-- Users can create reports
CREATE POLICY "Users can create reports" ON public.post_reports
  FOR INSERT 
  WITH CHECK (auth.uid() = reporter_id);

-- Users can view their own reports
CREATE POLICY "Users can view their own reports" ON public.post_reports
  FOR SELECT 
  USING (auth.uid() = reporter_id);

-- Admins can view all reports
CREATE POLICY "Admins can view all reports" ON public.post_reports
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'));

-- Admins can update reports
CREATE POLICY "Admins can update reports" ON public.post_reports
  FOR UPDATE 
  USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_post_reports_updated_at
  BEFORE UPDATE ON public.post_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add report_count to posts table
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS report_count INTEGER DEFAULT 0;

-- Create function to update report count
CREATE OR REPLACE FUNCTION public.update_post_report_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.posts
  SET report_count = (
    SELECT COUNT(*)
    FROM public.post_reports
    WHERE post_id = COALESCE(NEW.post_id, OLD.post_id)
    AND status = 'pending'
  )
  WHERE id = COALESCE(NEW.post_id, OLD.post_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger to update report count
CREATE TRIGGER update_report_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.post_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_post_report_count();