
-- Add government_type enum
CREATE TYPE public.government_type AS ENUM ('Central', 'State');

-- Add state and government_type columns to schemes
ALTER TABLE public.schemes ADD COLUMN state text;
ALTER TABLE public.schemes ADD COLUMN government_type public.government_type NOT NULL DEFAULT 'State';

-- Update existing TN schemes
UPDATE public.schemes SET state = 'Tamil Nadu', government_type = 'State';

-- Add state column to district_allocations
ALTER TABLE public.district_allocations ADD COLUMN state text;
UPDATE public.district_allocations SET state = 'Tamil Nadu';

-- Add state column to expenses
ALTER TABLE public.expenses ADD COLUMN state text;
UPDATE public.expenses SET state = 'Tamil Nadu';
