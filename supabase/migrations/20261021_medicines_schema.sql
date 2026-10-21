-- ==============================================================================
-- AIMAN Database Migration: Medicines, Ceiling Prices & Aliases
-- Module: Verified PMBI Jan Aushadhi & NPPA Data Model
-- ==============================================================================

-- 1. Medicines Table
CREATE TABLE IF NOT EXISTS public.medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name TEXT NOT NULL,
  generic_name TEXT NOT NULL,
  strength TEXT NOT NULL,
  dosage_form TEXT NOT NULL,
  pack_size INTEGER NOT NULL DEFAULT 10,
  pack_unit TEXT NOT NULL DEFAULT 'tablet',
  branded_mrp NUMERIC(10, 2) NOT NULL,
  jan_aushadhi_code TEXT,
  jan_aushadhi_mrp NUMERIC(10, 2),
  nppa_ceiling_price NUMERIC(10, 2),
  source_name TEXT NOT NULL,
  source_url TEXT,
  verified_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_medicines_brand ON public.medicines(LOWER(brand_name));
CREATE INDEX IF NOT EXISTS idx_medicines_generic ON public.medicines(LOWER(generic_name));
CREATE INDEX IF NOT EXISTS idx_medicines_strength ON public.medicines(strength);

-- 2. Medicine Aliases (Common Typos, Vernacular Names, Brand Variants)
CREATE TABLE IF NOT EXISTS public.medicine_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_id UUID NOT NULL REFERENCES public.medicines(id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  alias_type TEXT NOT NULL CHECK (alias_type IN ('misspelling', 'brand_variant', 'vernacular', 'salt_alias')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_medicine_aliases_alias ON public.medicine_aliases(LOWER(alias));

-- 3. Row Level Security (Publicly Readable, Admin/Script Writable)
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_aliases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read verified medicines"
  ON public.medicines
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read verified aliases"
  ON public.medicine_aliases
  FOR SELECT
  USING (true);
