-- Add onboarding_completed field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Update existing profiles to have onboarding completed
UPDATE public.profiles 
SET onboarding_completed = true 
WHERE onboarding_completed IS NULL;