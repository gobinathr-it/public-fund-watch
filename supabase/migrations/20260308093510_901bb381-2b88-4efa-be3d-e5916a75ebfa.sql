
-- Create enum for government scheme categories
CREATE TYPE public.govt_scheme_category AS ENUM (
  'Medical & Health',
  'Insurance',
  'Welfare Board',
  'Disability',
  'Senior Citizen',
  'Women Welfare',
  'Agriculture',
  'Housing',
  'Employment',
  'Social Justice'
);

-- Create government_schemes table
CREATE TABLE public.government_schemes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'All India',
  government_type public.government_type NOT NULL DEFAULT 'Central',
  category public.govt_scheme_category NOT NULL,
  department TEXT NOT NULL,
  description TEXT NOT NULL,
  eligibility_criteria TEXT NOT NULL,
  target_beneficiaries TEXT,
  benefit_amount TEXT NOT NULL,
  age_min INTEGER,
  age_max INTEGER,
  income_limit BIGINT,
  gender_eligibility public.gender_eligibility NOT NULL DEFAULT 'Both',
  required_documents TEXT[] NOT NULL DEFAULT '{}',
  application_process TEXT,
  application_link TEXT,
  coverage_amount TEXT,
  premium TEXT,
  status public.scheme_status NOT NULL DEFAULT 'Active',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Anyone can view government schemes"
  ON public.government_schemes
  FOR SELECT
  USING (true);
