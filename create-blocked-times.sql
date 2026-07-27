-- 1. Tabloyu oluştur
CREATE TABLE IF NOT EXISTS public.barber_blocked_times (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    barber_id UUID REFERENCES public.barbers(id) ON DELETE CASCADE,
    blocked_date DATE NOT NULL,
    blocked_time TEXT NOT NULL, -- Örn: "14:30"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(barber_id, blocked_date, blocked_time)
);

-- 2. RLS (Güvenlik Kalkanı) Aktifleştir
ALTER TABLE public.barber_blocked_times ENABLE ROW LEVEL SECURITY;

-- 3. Politikalar (Sadece giriş yapanlar ekleyip silebilir, herkes okuyabilir)
DROP POLICY IF EXISTS "Herkes kapalı saatleri görebilir" ON public.barber_blocked_times;
CREATE POLICY "Herkes kapalı saatleri görebilir" ON public.barber_blocked_times FOR SELECT USING (true);

DROP POLICY IF EXISTS "Personel kendi saatlerini kapatabilir" ON public.barber_blocked_times;
CREATE POLICY "Personel kendi saatlerini kapatabilir" ON public.barber_blocked_times FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Personel kapalı saatini açabilir" ON public.barber_blocked_times;
CREATE POLICY "Personel kapalı saatini açabilir" ON public.barber_blocked_times FOR DELETE USING (auth.role() = 'authenticated');
