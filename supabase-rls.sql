-- Veri Güvenliği (Row Level Security - RLS) Politikaları

-- 1. Tablolarda güvenlik kalkanını (RLS) aktif ediyoruz
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- DİKKAT: Personel (staff) girişi, tüm RLS duvarlarını aşmaması için 
-- Kritik "Silme" ve "Ayarları Değiştirme" yetkilerini sadece PATRON hesabına (harunwidded@gmail.com) veriyoruz.
-- Personeller sadece randevu güncelleyebilir.

-- 2. Hizmetler (Services) ve Personeller (Barbers)
-- Herkes okuyabilir, SADECE PATRON değiştirebilir.
DROP POLICY IF EXISTS "Herkes hizmetleri okuyabilir" ON services;
CREATE POLICY "Herkes hizmetleri okuyabilir" ON services FOR SELECT USING (true);
DROP POLICY IF EXISTS "Sadece patron hizmet düzenleyebilir" ON services;
DROP POLICY IF EXISTS "Sadece admin hizmet düzenleyebilir" ON services;
CREATE POLICY "Sadece patron hizmet düzenleyebilir" ON services USING (auth.jwt()->>'email' = 'harunwidded@gmail.com');

DROP POLICY IF EXISTS "Herkes personeli okuyabilir" ON barbers;
CREATE POLICY "Herkes personeli okuyabilir" ON barbers FOR SELECT USING (true);
DROP POLICY IF EXISTS "Sadece patron personel düzenleyebilir" ON barbers;
DROP POLICY IF EXISTS "Sadece admin personel düzenleyebilir" ON barbers;
CREATE POLICY "Sadece patron personel düzenleyebilir" ON barbers USING (auth.jwt()->>'email' = 'harunwidded@gmail.com');

-- 3. Sistem Ayarları (Settings)
-- Herkes okuyabilir, SADECE PATRON değiştirebilir.
DROP POLICY IF EXISTS "Herkes ayarları okuyabilir" ON settings;
CREATE POLICY "Herkes ayarları okuyabilir" ON settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Sadece patron ayarları düzenleyebilir" ON settings;
DROP POLICY IF EXISTS "Sadece admin ayarları düzenleyebilir" ON settings;
CREATE POLICY "Sadece patron ayarları düzenleyebilir" ON settings USING (auth.jwt()->>'email' = 'harunwidded@gmail.com');

-- 4. Randevular (Appointments)
-- Müşteriler (anon) ekleyebilir.
-- Adminler ve personeller (authenticated) okuyabilir ve GÜNCELLEYEBİLİR (Randevuyu tamamlandı yapmak için).
-- SADECE PATRON silebilir.
DROP POLICY IF EXISTS "Müşteriler randevu ekleyebilir" ON appointments;
CREATE POLICY "Müşteriler randevu ekleyebilir" ON appointments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Personel ve patron okuyabilir" ON appointments;
DROP POLICY IF EXISTS "Sadece adminler randevuları okuyabilir" ON appointments;
CREATE POLICY "Personel ve patron okuyabilir" ON appointments FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Personel ve patron güncelleyebilir" ON appointments;
DROP POLICY IF EXISTS "Sadece adminler randevuları güncelleyebilir" ON appointments;
CREATE POLICY "Personel ve patron güncelleyebilir" ON appointments FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Sadece patron randevu silebilir" ON appointments;
DROP POLICY IF EXISTS "Sadece adminler randevuları silebilir" ON appointments;
CREATE POLICY "Sadece patron randevu silebilir" ON appointments FOR DELETE USING (auth.jwt()->>'email' = 'harunwidded@gmail.com');

-- 5. Randevu - Hizmet Eşleşmesi (Appointment Services)
DROP POLICY IF EXISTS "Müşteriler randevu-hizmet ekleyebilir" ON appointment_services;
CREATE POLICY "Müşteriler randevu-hizmet ekleyebilir" ON appointment_services FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Sadece adminler görebilir ve yönetebilir" ON appointment_services;
CREATE POLICY "Sadece adminler görebilir ve yönetebilir" ON appointment_services FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Sadece adminler düzenleyebilir ve silebilir" ON appointment_services;
CREATE POLICY "Sadece adminler düzenleyebilir ve silebilir" ON appointment_services FOR ALL USING (auth.role() = 'authenticated');
