-- Create marketplace reviews table
CREATE TABLE public.marketplace_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.marketplace_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view reviews"
ON public.marketplace_reviews
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create their own reviews"
ON public.marketplace_reviews
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own reviews"
ON public.marketplace_reviews
FOR UPDATE
TO authenticated
USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete their own reviews"
ON public.marketplace_reviews
FOR DELETE
TO authenticated
USING (auth.uid() = reviewer_id);

-- Create index for faster queries
CREATE INDEX idx_marketplace_reviews_listing_id ON public.marketplace_reviews(listing_id);
CREATE INDEX idx_marketplace_reviews_reviewer_id ON public.marketplace_reviews(reviewer_id);

-- Add trigger for updated_at
CREATE TRIGGER update_marketplace_reviews_updated_at
BEFORE UPDATE ON public.marketplace_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add average rating and review count columns to marketplace_listings
ALTER TABLE public.marketplace_listings 
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Function to update listing ratings
CREATE OR REPLACE FUNCTION update_listing_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.marketplace_listings
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM public.marketplace_reviews
      WHERE listing_id = COALESCE(NEW.listing_id, OLD.listing_id)
    ),
    review_count = (
      SELECT COUNT(*)
      FROM public.marketplace_reviews
      WHERE listing_id = COALESCE(NEW.listing_id, OLD.listing_id)
    )
  WHERE id = COALESCE(NEW.listing_id, OLD.listing_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update ratings when reviews change
CREATE TRIGGER update_listing_rating_on_review
AFTER INSERT OR UPDATE OR DELETE ON public.marketplace_reviews
FOR EACH ROW
EXECUTE FUNCTION update_listing_rating();