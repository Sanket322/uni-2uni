-- Create content categories enum
CREATE TYPE content_category AS ENUM (
  'feeding_guidelines',
  'shelter_management',
  'breeding_tips',
  'health_advisory',
  'training_resources',
  'emergency_alerts',
  'disease_prevention',
  'weather_advisory',
  'best_practices'
);

-- Create content types enum
CREATE TYPE content_type AS ENUM (
  'article',
  'video',
  'infographic',
  'document',
  'audio',
  'webinar',
  'tutorial'
);

-- Create CMS content table
CREATE TABLE public.cms_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  content_body text,
  category content_category NOT NULL,
  content_type content_type NOT NULL,
  species text[], -- applicable animal species
  state text, -- location filter
  district text,
  language text DEFAULT 'en',
  media_url text,
  thumbnail_url text,
  download_url text,
  tags text[],
  view_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  published_date timestamp with time zone,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active content"
  ON public.cms_content
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage all content"
  ON public.cms_content
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Create content views tracking
CREATE TABLE public.content_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES public.cms_content(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  viewed_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.content_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own views"
  ON public.content_views
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all views"
  ON public.content_views
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Create indexes for better performance
CREATE INDEX idx_cms_content_category ON public.cms_content(category);
CREATE INDEX idx_cms_content_type ON public.cms_content(content_type);
CREATE INDEX idx_cms_content_species ON public.cms_content USING GIN(species);
CREATE INDEX idx_cms_content_tags ON public.cms_content USING GIN(tags);
CREATE INDEX idx_cms_content_location ON public.cms_content(state, district);
CREATE INDEX idx_cms_content_active ON public.cms_content(is_active);

-- Add trigger for updated_at
CREATE TRIGGER update_cms_content_updated_at
  BEFORE UPDATE ON public.cms_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();