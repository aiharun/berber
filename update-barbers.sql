-- Berbere 6 haneli PIN sütunu ekler. Personel bazlı POS tarzı giriş sistemi için kullanılacaktır.
ALTER TABLE barbers DROP COLUMN IF EXISTS email;
ALTER TABLE barbers ADD COLUMN IF NOT EXISTS pin TEXT;
