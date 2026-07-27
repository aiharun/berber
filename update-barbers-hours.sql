-- 1. Barbers tablosuna working_hours sütununu ekle
ALTER TABLE public.barbers ADD COLUMN IF NOT EXISTS working_hours JSONB DEFAULT '[]'::jsonb;
