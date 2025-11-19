-- Create helpdesk ticket status enum
CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- Create helpdesk ticket priority enum
CREATE TYPE public.ticket_priority AS ENUM ('low', 'medium', 'high', 'critical');

-- Create helpdesk tickets table
CREATE TABLE public.helpdesk_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  priority public.ticket_priority DEFAULT 'medium',
  status public.ticket_status DEFAULT 'open',
  assigned_to UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  sla_breach BOOLEAN DEFAULT false
);

-- Create helpdesk responses table
CREATE TABLE public.helpdesk_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.helpdesk_tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_internal_note BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create SLA configuration table
CREATE TABLE public.helpdesk_sla_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  priority public.ticket_priority NOT NULL UNIQUE,
  response_time_hours INTEGER NOT NULL,
  resolution_time_hours INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default SLA configurations
INSERT INTO public.helpdesk_sla_config (priority, response_time_hours, resolution_time_hours) VALUES
  ('critical', 1, 4),
  ('high', 4, 24),
  ('medium', 8, 48),
  ('low', 24, 120);

-- Enable RLS
ALTER TABLE public.helpdesk_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.helpdesk_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.helpdesk_sla_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies for helpdesk_tickets
CREATE POLICY "Users can view their own tickets"
  ON public.helpdesk_tickets
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all tickets"
  ON public.helpdesk_tickets
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert their own tickets"
  ON public.helpdesk_tickets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets"
  ON public.helpdesk_tickets
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all tickets"
  ON public.helpdesk_tickets
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for helpdesk_responses
CREATE POLICY "Users can view responses to their tickets"
  ON public.helpdesk_responses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.helpdesk_tickets
      WHERE id = helpdesk_responses.ticket_id
      AND user_id = auth.uid()
    )
    AND is_internal_note = false
  );

CREATE POLICY "Admins can view all responses"
  ON public.helpdesk_responses
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert responses to their tickets"
  ON public.helpdesk_responses
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.helpdesk_tickets
      WHERE id = helpdesk_responses.ticket_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert responses"
  ON public.helpdesk_responses
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for helpdesk_sla_config
CREATE POLICY "Anyone can view SLA config"
  ON public.helpdesk_sla_config
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage SLA config"
  ON public.helpdesk_sla_config
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_helpdesk_tickets_updated_at
  BEFORE UPDATE ON public.helpdesk_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_helpdesk_sla_config_updated_at
  BEFORE UPDATE ON public.helpdesk_sla_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();