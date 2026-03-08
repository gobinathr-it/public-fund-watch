
-- Create enums for scholarships
CREATE TYPE public.gender_eligibility AS ENUM ('Boys', 'Girls', 'Both');
CREATE TYPE public.education_level AS ENUM ('School', 'College', 'Engineering', 'Medical', 'Postgraduate', 'All');
CREATE TYPE public.scholarship_category AS ENUM ('Merit', 'Financial', 'Minority', 'SC/ST', 'BC/OBC', 'Women', 'Disability', 'General');

-- Create scholarships table
CREATE TABLE public.scholarships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'All India',
  department TEXT NOT NULL,
  description TEXT NOT NULL,
  eligibility_criteria TEXT NOT NULL,
  age_min INTEGER,
  age_max INTEGER,
  income_limit BIGINT,
  gender_eligibility gender_eligibility NOT NULL DEFAULT 'Both',
  education_level education_level NOT NULL DEFAULT 'All',
  category scholarship_category NOT NULL DEFAULT 'General',
  required_documents TEXT[] NOT NULL DEFAULT '{}',
  application_process TEXT,
  benefit_amount TEXT NOT NULL,
  application_link TEXT,
  government_type government_type NOT NULL DEFAULT 'Central',
  course_type TEXT,
  status scheme_status NOT NULL DEFAULT 'Active',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Anyone can view scholarships" ON public.scholarships FOR SELECT USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_scholarships_updated_at
  BEFORE UPDATE ON public.scholarships
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
