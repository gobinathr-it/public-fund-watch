-- Create enum for scheme categories
CREATE TYPE public.scheme_category AS ENUM (
  'Education', 'Healthcare', 'Agriculture', 'Welfare', 'Infrastructure', 'Housing', 'Employment', 'Women & Child', 'Social Justice'
);

-- Create enum for scheme status
CREATE TYPE public.scheme_status AS ENUM ('Active', 'Completed', 'Upcoming', 'Suspended');

-- Create enum for expense status
CREATE TYPE public.expense_status AS ENUM ('Verified', 'Pending', 'Flagged', 'Rejected');

-- Schemes table
CREATE TABLE public.schemes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_ta TEXT,
  department TEXT NOT NULL,
  description TEXT NOT NULL,
  description_ta TEXT,
  total_budget BIGINT NOT NULL,
  spent BIGINT NOT NULL DEFAULT 0,
  category scheme_category NOT NULL,
  status scheme_status NOT NULL DEFAULT 'Active',
  target_beneficiaries TEXT,
  announcement_date DATE,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- District allocations table
CREATE TABLE public.district_allocations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scheme_id UUID NOT NULL REFERENCES public.schemes(id) ON DELETE CASCADE,
  district TEXT NOT NULL,
  allocated BIGINT NOT NULL,
  spent BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Expenses table
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scheme_id UUID NOT NULL REFERENCES public.schemes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount BIGINT NOT NULL,
  category TEXT NOT NULL,
  department TEXT NOT NULL,
  district TEXT NOT NULL,
  description TEXT,
  expense_date DATE NOT NULL,
  status expense_status NOT NULL DEFAULT 'Pending',
  has_proof BOOLEAN NOT NULL DEFAULT false,
  proof_url TEXT,
  geo_lat DOUBLE PRECISION,
  geo_lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.district_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view schemes" ON public.schemes FOR SELECT USING (true);
CREATE POLICY "Anyone can view district allocations" ON public.district_allocations FOR SELECT USING (true);
CREATE POLICY "Anyone can view expenses" ON public.expenses FOR SELECT USING (true);

-- Indexes
CREATE INDEX idx_schemes_category ON public.schemes(category);
CREATE INDEX idx_schemes_status ON public.schemes(status);
CREATE INDEX idx_district_allocations_scheme ON public.district_allocations(scheme_id);
CREATE INDEX idx_district_allocations_district ON public.district_allocations(district);
CREATE INDEX idx_expenses_scheme ON public.expenses(scheme_id);
CREATE INDEX idx_expenses_district ON public.expenses(district);
CREATE INDEX idx_expenses_status ON public.expenses(status);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_schemes_updated_at
  BEFORE UPDATE ON public.schemes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();