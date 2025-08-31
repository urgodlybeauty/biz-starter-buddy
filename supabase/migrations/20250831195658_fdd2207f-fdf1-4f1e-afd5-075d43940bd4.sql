-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  company_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create EIN applications table
CREATE TABLE public.ein_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  responsible_party_name TEXT NOT NULL,
  responsible_party_ssn TEXT,
  business_address TEXT NOT NULL,
  business_city TEXT NOT NULL,
  business_state TEXT NOT NULL,
  business_zip TEXT NOT NULL,
  mailing_address TEXT,
  business_purpose TEXT NOT NULL,
  start_date DATE,
  employees_expected INTEGER DEFAULT 0,
  banking_info TEXT,
  federal_tax_deposits TEXT,
  business_activity_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create LLC applications table
CREATE TABLE public.llc_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  llc_name TEXT NOT NULL,
  business_purpose TEXT NOT NULL,
  business_address TEXT NOT NULL,
  business_city TEXT NOT NULL,
  business_state TEXT NOT NULL,
  business_zip TEXT NOT NULL,
  registered_agent_name TEXT NOT NULL,
  registered_agent_address TEXT NOT NULL,
  organizer_name TEXT NOT NULL,
  organizer_address TEXT NOT NULL,
  management_structure TEXT NOT NULL,
  member_names TEXT[],
  effective_date DATE,
  duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create business licenses table
CREATE TABLE public.business_licenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_type TEXT NOT NULL,
  business_zip TEXT NOT NULL,
  business_state TEXT NOT NULL,
  required_licenses TEXT[],
  license_links TEXT[],
  permit_requirements TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create banking options table
CREATE TABLE public.banking_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  zip_code TEXT NOT NULL,
  bank_results JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ein_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.llc_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banking_options ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for EIN applications
CREATE POLICY "Users can view their own EIN applications" ON public.ein_applications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own EIN applications" ON public.ein_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own EIN applications" ON public.ein_applications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for LLC applications
CREATE POLICY "Users can view their own LLC applications" ON public.llc_applications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own LLC applications" ON public.llc_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own LLC applications" ON public.llc_applications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for business licenses
CREATE POLICY "Users can view their own business licenses" ON public.business_licenses
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own business licenses" ON public.business_licenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own business licenses" ON public.business_licenses
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for banking options
CREATE POLICY "Users can view their own banking options" ON public.banking_options
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own banking options" ON public.banking_options
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own banking options" ON public.banking_options
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ein_applications_updated_at
  BEFORE UPDATE ON public.ein_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_llc_applications_updated_at
  BEFORE UPDATE ON public.llc_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_licenses_updated_at
  BEFORE UPDATE ON public.business_licenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_banking_options_updated_at
  BEFORE UPDATE ON public.banking_options
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();