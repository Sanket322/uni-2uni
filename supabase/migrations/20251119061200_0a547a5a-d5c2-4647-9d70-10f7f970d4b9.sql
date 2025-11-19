-- Fix function search path for update_listing_rating
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;