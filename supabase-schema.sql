-- Berber Randevu Sistemi Veritabanı Şeması

-- 1. Hizmetler Tablosu (Services)
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  duration INTEGER NOT NULL, -- dakika cinsinden
  price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Personel/Berberler Tablosu (Barbers)
CREATE TABLE barbers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Randevular Tablosu (Appointments)
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_first_name TEXT NOT NULL,
  customer_last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  barber_id UUID REFERENCES barbers(id) ON DELETE SET NULL, -- NULL ise "Farketmez"
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'completed', 'cancelled')),
  total_price NUMERIC NOT NULL,
  total_duration INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Randevu-Hizmet İlişki Tablosu (Appointment Services)
CREATE TABLE appointment_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE
);

-- 5. Sistem Ayarları (Settings)
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- Örnek Başlangıç Verileri (Mock Data)
INSERT INTO services (name, duration, price) VALUES
  ('Saç Kesimi', 30, 200),
  ('Sakal Tıraşı', 20, 100),
  ('Saç & Sakal Kesimi', 45, 280),
  ('Cilt Bakımı', 30, 150),
  ('Saç Yıkama ve Şekillendirme', 15, 80);

INSERT INTO barbers (name) VALUES
  ('Ahmet Yılmaz'),
  ('Mehmet Kaya'),
  ('Canberk Demir');

-- Varsayılan çalışma saatleri periyodunu JSON olarak ayarlara ekleyelim.
-- Bunu admin panelinden çekeceğiz.
INSERT INTO settings (key, value) VALUES (
  'working_hours',
  '["10:00", "10:45", "11:30", "12:15", "13:00", "13:45", "14:30", "15:15", "16:00", "16:45", "17:30", "18:15", "19:00", "19:45", "20:30", "21:15", "22:00", "22:45", "23:30", "00:00"]'
);
