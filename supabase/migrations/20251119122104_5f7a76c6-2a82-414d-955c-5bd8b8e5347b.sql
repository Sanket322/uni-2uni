-- Create marketplace_enquiries table for buyer inquiries
CREATE TABLE IF NOT EXISTS public.marketplace_enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  buyer_email TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.marketplace_enquiries ENABLE ROW LEVEL SECURITY;

-- Sellers can view enquiries for their listings
CREATE POLICY "Sellers can view enquiries for their listings"
ON public.marketplace_enquiries
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.marketplace_listings
    WHERE marketplace_listings.id = marketplace_enquiries.listing_id
    AND marketplace_listings.seller_id = auth.uid()
  )
);

-- Buyers can view their own enquiries
CREATE POLICY "Buyers can view their own enquiries"
ON public.marketplace_enquiries
FOR SELECT
USING (auth.uid() = buyer_id);

-- Anyone authenticated can create enquiries
CREATE POLICY "Users can create enquiries"
ON public.marketplace_enquiries
FOR INSERT
WITH CHECK (auth.uid() = buyer_id);

-- Buyers can update their own enquiries
CREATE POLICY "Buyers can update their own enquiries"
ON public.marketplace_enquiries
FOR UPDATE
USING (auth.uid() = buyer_id);

-- Sellers can update enquiry status
CREATE POLICY "Sellers can update enquiry status"
ON public.marketplace_enquiries
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.marketplace_listings
    WHERE marketplace_listings.id = marketplace_enquiries.listing_id
    AND marketplace_listings.seller_id = auth.uid()
  )
);

-- Admins can view all enquiries
CREATE POLICY "Admins can view all enquiries"
ON public.marketplace_enquiries
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger to update updated_at
CREATE TRIGGER update_marketplace_enquiries_updated_at
  BEFORE UPDATE ON public.marketplace_enquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_marketplace_enquiries_listing_id ON public.marketplace_enquiries(listing_id);
CREATE INDEX idx_marketplace_enquiries_buyer_id ON public.marketplace_enquiries(buyer_id);