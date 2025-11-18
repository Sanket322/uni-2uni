-- Create enums for various categories
CREATE TYPE public.app_role AS ENUM ('farmer', 'veterinary_officer', 'program_coordinator', 'admin');
CREATE TYPE public.animal_species AS ENUM ('cattle', 'goat', 'sheep', 'poultry', 'buffalo', 'pig', 'other');
CREATE TYPE public.animal_gender AS ENUM ('male', 'female');
CREATE TYPE public.health_status AS ENUM ('healthy', 'sick', 'under_treatment', 'quarantine', 'deceased');
CREATE TYPE public.listing_status AS ENUM ('active', 'sold', 'inactive');
CREATE TYPE public.priority_level AS ENUM ('low', 'medium', 'high', 'critical');

-- User profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  preferred_language TEXT DEFAULT 'en',
  state TEXT,
  district TEXT,
  village TEXT,
  pin_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Animals table
CREATE TABLE public.animals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT,
  species animal_species NOT NULL,
  breed TEXT,
  gender animal_gender,
  date_of_birth DATE,
  identification_number TEXT,
  photo_url TEXT,
  health_status health_status DEFAULT 'healthy',
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health records table
CREATE TABLE public.health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID REFERENCES public.animals(id) ON DELETE CASCADE NOT NULL,
  recorded_by UUID REFERENCES auth.users(id),
  record_date DATE NOT NULL,
  symptoms TEXT,
  diagnosis TEXT,
  treatment TEXT,
  prescription TEXT,
  veterinarian_notes TEXT,
  next_checkup_date DATE,
  attachments JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vaccinations table
CREATE TABLE public.vaccinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID REFERENCES public.animals(id) ON DELETE CASCADE NOT NULL,
  vaccine_name TEXT NOT NULL,
  vaccine_type TEXT,
  administered_date DATE NOT NULL,
  administered_by TEXT,
  next_due_date DATE,
  batch_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Breeding records table
CREATE TABLE public.breeding_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID REFERENCES public.animals(id) ON DELETE CASCADE NOT NULL,
  breeding_date DATE NOT NULL,
  breeding_method TEXT,
  partner_details TEXT,
  expected_delivery_date DATE,
  actual_delivery_date DATE,
  offspring_count INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feeding schedules table
CREATE TABLE public.feeding_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID REFERENCES public.animals(id) ON DELETE CASCADE NOT NULL,
  feed_type TEXT NOT NULL,
  quantity TEXT,
  frequency TEXT,
  special_instructions TEXT,
  season TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketplace listings table
CREATE TABLE public.marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  animal_id UUID REFERENCES public.animals(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  location TEXT NOT NULL,
  contact_number TEXT,
  photos JSONB,
  status listing_status DEFAULT 'active',
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Government schemes table
CREATE TABLE public.government_schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_name TEXT NOT NULL,
  description TEXT,
  eligibility_criteria TEXT,
  benefits TEXT,
  application_process TEXT,
  documents_required TEXT[],
  official_website TEXT,
  contact_details TEXT,
  state TEXT,
  district TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency contacts table
CREATE TABLE public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  contact_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  relationship TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT,
  priority priority_level DEFAULT 'medium',
  is_read BOOLEAN DEFAULT FALSE,
  related_entity_type TEXT,
  related_entity_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback table
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  category TEXT,
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI chat history table
CREATE TABLE public.ai_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  animal_id UUID REFERENCES public.animals(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  response TEXT,
  symptoms TEXT,
  diagnosis_confidence DECIMAL(3, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather alerts table
CREATE TABLE public.weather_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state TEXT NOT NULL,
  district TEXT,
  alert_type TEXT NOT NULL,
  severity TEXT,
  description TEXT NOT NULL,
  advisory TEXT,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breeding_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feeding_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_alerts ENABLE ROW LEVEL SECURITY;

-- Create function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for animals
CREATE POLICY "Users can view their own animals"
  ON public.animals FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Admins and veterinary officers can view all animals"
  ON public.animals FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'veterinary_officer') OR
    public.has_role(auth.uid(), 'program_coordinator')
  );

CREATE POLICY "Users can insert their own animals"
  ON public.animals FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own animals"
  ON public.animals FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own animals"
  ON public.animals FOR DELETE
  USING (auth.uid() = owner_id);

-- RLS Policies for health_records
CREATE POLICY "Users can view health records of their animals"
  ON public.health_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.animals 
      WHERE animals.id = health_records.animal_id 
      AND animals.owner_id = auth.uid()
    ) OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'veterinary_officer')
  );

CREATE POLICY "Veterinary officers and admins can insert health records"
  ON public.health_records FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'veterinary_officer') OR
    public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for vaccinations
CREATE POLICY "Users can view vaccinations of their animals"
  ON public.vaccinations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.animals 
      WHERE animals.id = vaccinations.animal_id 
      AND animals.owner_id = auth.uid()
    ) OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'veterinary_officer')
  );

CREATE POLICY "Users can insert vaccinations for their animals"
  ON public.vaccinations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.animals 
      WHERE animals.id = vaccinations.animal_id 
      AND animals.owner_id = auth.uid()
    )
  );

-- RLS Policies for breeding_records
CREATE POLICY "Users can view breeding records of their animals"
  ON public.breeding_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.animals 
      WHERE animals.id = breeding_records.animal_id 
      AND animals.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage breeding records of their animals"
  ON public.breeding_records FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.animals 
      WHERE animals.id = breeding_records.animal_id 
      AND animals.owner_id = auth.uid()
    )
  );

-- RLS Policies for feeding_schedules
CREATE POLICY "Users can manage feeding schedules of their animals"
  ON public.feeding_schedules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.animals 
      WHERE animals.id = feeding_schedules.animal_id 
      AND animals.owner_id = auth.uid()
    )
  );

-- RLS Policies for marketplace_listings
CREATE POLICY "Anyone can view active marketplace listings"
  ON public.marketplace_listings FOR SELECT
  USING (status = 'active' OR seller_id = auth.uid());

CREATE POLICY "Users can insert their own listings"
  ON public.marketplace_listings FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own listings"
  ON public.marketplace_listings FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete their own listings"
  ON public.marketplace_listings FOR DELETE
  USING (auth.uid() = seller_id);

-- RLS Policies for government_schemes
CREATE POLICY "Anyone can view active schemes"
  ON public.government_schemes FOR SELECT
  USING (is_active = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage schemes"
  ON public.government_schemes FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for emergency_contacts
CREATE POLICY "Users can manage their own emergency contacts"
  ON public.emergency_contacts FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for feedback
CREATE POLICY "Users can insert their own feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback"
  ON public.feedback FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for ai_chat_history
CREATE POLICY "Users can manage their own chat history"
  ON public.ai_chat_history FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for weather_alerts
CREATE POLICY "Anyone authenticated can view weather alerts"
  ON public.weather_alerts FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Admins can manage weather alerts"
  ON public.weather_alerts FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_animals_updated_at
  BEFORE UPDATE ON public.animals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feeding_schedules_updated_at
  BEFORE UPDATE ON public.feeding_schedules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketplace_listings_updated_at
  BEFORE UPDATE ON public.marketplace_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_government_schemes_updated_at
  BEFORE UPDATE ON public.government_schemes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', '')
  );
  
  -- Assign default farmer role to new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'farmer');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();