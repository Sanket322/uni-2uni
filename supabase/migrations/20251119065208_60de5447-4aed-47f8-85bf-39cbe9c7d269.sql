-- Create feed_inventory table for tracking feed stock
CREATE TABLE public.feed_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  feed_name TEXT NOT NULL,
  feed_type TEXT NOT NULL, -- green_fodder, dry_fodder, concentrate, supplement, mineral_mix
  quantity NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL, -- kg, bundle, bag, liter
  cost_per_unit NUMERIC,
  supplier_name TEXT,
  purchase_date DATE,
  expiry_date DATE,
  storage_location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create feeding_logs table for tracking actual feeding events
CREATE TABLE public.feeding_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_id UUID NOT NULL REFERENCES public.animals(id) ON DELETE CASCADE,
  schedule_id UUID REFERENCES public.feeding_schedules(id) ON DELETE SET NULL,
  feed_type TEXT NOT NULL,
  quantity_fed TEXT NOT NULL,
  fed_by UUID,
  feeding_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  animal_response TEXT, -- good, poor, refused, normal
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create feed_cost_tracking table for cost analysis
CREATE TABLE public.feed_cost_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  animal_id UUID REFERENCES public.animals(id) ON DELETE CASCADE,
  feed_type TEXT NOT NULL,
  quantity_consumed NUMERIC NOT NULL,
  cost NUMERIC NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.feed_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feeding_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_cost_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for feed_inventory
CREATE POLICY "Users can manage their own feed inventory"
  ON public.feed_inventory
  FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for feeding_logs
CREATE POLICY "Users can view feeding logs of their animals"
  ON public.feeding_logs
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.animals 
    WHERE animals.id = feeding_logs.animal_id 
    AND animals.owner_id = auth.uid()
  ) OR has_role(auth.uid(), 'veterinary_officer'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert feeding logs for their animals"
  ON public.feeding_logs
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.animals 
    WHERE animals.id = feeding_logs.animal_id 
    AND animals.owner_id = auth.uid()
  ));

CREATE POLICY "Users can update their own feeding logs"
  ON public.feeding_logs
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.animals 
    WHERE animals.id = feeding_logs.animal_id 
    AND animals.owner_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own feeding logs"
  ON public.feeding_logs
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.animals 
    WHERE animals.id = feeding_logs.animal_id 
    AND animals.owner_id = auth.uid()
  ));

-- RLS Policies for feed_cost_tracking
CREATE POLICY "Users can manage their own feed costs"
  ON public.feed_cost_tracking
  FOR ALL
  USING (auth.uid() = user_id);

-- Create trigger for updated_at on feed_inventory
CREATE TRIGGER update_feed_inventory_updated_at
  BEFORE UPDATE ON public.feed_inventory
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_feed_inventory_user_id ON public.feed_inventory(user_id);
CREATE INDEX idx_feeding_logs_animal_id ON public.feeding_logs(animal_id);
CREATE INDEX idx_feeding_logs_schedule_id ON public.feeding_logs(schedule_id);
CREATE INDEX idx_feeding_logs_feeding_time ON public.feeding_logs(feeding_time);
CREATE INDEX idx_feed_cost_tracking_user_id ON public.feed_cost_tracking(user_id);
CREATE INDEX idx_feed_cost_tracking_animal_id ON public.feed_cost_tracking(animal_id);
CREATE INDEX idx_feed_cost_tracking_date ON public.feed_cost_tracking(date);