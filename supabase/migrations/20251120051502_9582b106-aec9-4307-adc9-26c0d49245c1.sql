-- Add reminder tracking to marketplace_enquiries
ALTER TABLE public.marketplace_enquiries 
ADD COLUMN reminder_sent BOOLEAN DEFAULT false;

-- Create index for efficient querying of pending enquiries
CREATE INDEX idx_marketplace_enquiries_reminder 
ON public.marketplace_enquiries(created_at, status, reminder_sent)
WHERE status = 'pending' AND reminder_sent = false;