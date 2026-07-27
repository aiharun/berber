import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Lock, Mail, Loader2, AlertCircle, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Barber } from '../../context/BookingContext';

const Login = () => {
  const [loginMode, setLoginMode] = useState<'admin' | 'staff'>('staff');
  
  // Admin form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Staff form state
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<string>('');
  const [pin, setPin] = useState('');
  
  // Common state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const { data, error } = await supabase
          .from('barbers')
          .select('*')
          .order('name', { ascending: true });
        
        if (!error && data) {
          setBarbers(data);
        }
      } catch (err) {
        console.error("Personeller çekilemedi", err);
      }
    };
    
    if (loginMode === 'staff') {
      fetchBarbers();
    }
  }, [loginMode]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Süper admin girişi başarılı
      localStorage.removeItem('staff_barber_id'); // Personel ID'sini temizle
      navigate('/admin');
    } catch (err: any) {
      console.error("Giriş hatası:", err);
      setError('E-posta veya şifre hatalı.');
    } finally {
      setLoading(false);
    }
  };

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBarber || pin.length !== 6) {
      setError('Lütfen bir personel seçin ve 6 haneli PIN kodunuzu girin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. PIN kontrolü yap
      const barber = barbers.find(b => b.id === selectedBarber);
      if (!barber) throw new Error('Personel bulunamadı');
      
      if (!barber.pin || barber.pin !== pin) {
        throw new Error('PIN kodu hatalı veya bu personel için giriş yetkisi yok.');
      }

      // 2. Ortak personel hesabı ile Supabase Auth'a giriş yap (RLS'yi geçmek için)
      const staffEmail = import.meta.env.VITE_STAFF_EMAIL;
      const staffPassword = import.meta.env.VITE_STAFF_PASSWORD;
      
      if (!staffEmail || !staffPassword) {
        throw new Error('Sistemde personel giriş ayarları yapılmamış (.env eksik).');
      }

      // 3. Ortak personel hesabı ile Supabase Auth'a giriş yap (RLS'yi geçmek için)
      // Önce localStorage'a kaydediyoruz ki auth.onAuthStateChange tetiklendiğinde context doğru ID'yi okuyabilsin.
      localStorage.setItem('staff_barber_id', selectedBarber);
      
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: staffEmail,
        password: staffPassword,
      });

      if (authError) {
        localStorage.removeItem('staff_barber_id');
        throw authError;
      }

      // 4. Başarılı giriş, yönlendir
      navigate('/admin/appointments');
    } catch (err: any) {
      console.error("Personel giriş hatası:", err);
      setError(err.message || 'Giriş yapılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md bg-white border border-border/60 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="space-y-4 text-center border-b border-border/50 pb-6 bg-secondary/20">
          <div className="flex justify-center space-x-2 w-full p-1 bg-secondary/50 rounded-xl">
            <button
              onClick={() => { setLoginMode('staff'); setError(null); }}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all",
                loginMode === 'staff' ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Personel Girişi
            </button>
            <button
              onClick={() => { setLoginMode('admin'); setError(null); }}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all",
                loginMode === 'admin' ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Yönetici Girişi
            </button>
          </div>
          
          <div className="pt-2">
            <CardTitle className="text-2xl font-bold text-foreground">
              {loginMode === 'admin' ? 'Yönetici Girişi' : 'Personel Girişi'}
            </CardTitle>
            <CardDescription className="font-medium text-muted-foreground mt-2">
              {loginMode === 'admin' ? 'Yönetim paneline erişmek için giriş yapın' : 'Kendi randevularınızı görmek için PIN girin'}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="pt-8 px-8 pb-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center text-sm text-red-600 font-medium shadow-sm">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              {error}
            </div>
          )}

          {loginMode === 'admin' ? (
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold text-sm text-foreground">E-posta</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@ornek.com"
                    className="pl-12 rounded-xl border-border py-6 text-base focus-visible:ring-gold-500 focus-visible:ring-1 transition-shadow bg-secondary/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="font-semibold text-sm text-foreground">Şifre</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    className="pl-12 rounded-xl border-border py-6 text-base focus-visible:ring-gold-500 focus-visible:ring-1 transition-shadow bg-secondary/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gold-500 hover:bg-gold-600 text-white font-semibold text-lg h-14 rounded-xl shadow-md hover:shadow-lg transition-all mt-6"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Giriş Yap'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleStaffLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="barber" className="font-semibold text-sm text-foreground">İsminizi Seçin</Label>
                <select
                  id="barber"
                  value={selectedBarber}
                  onChange={(e) => setSelectedBarber(e.target.value)}
                  className="w-full pl-4 pr-10 rounded-xl border-border py-4 text-base focus-visible:ring-gold-500 focus-visible:ring-1 transition-shadow bg-secondary/20 border outline-none appearance-none font-medium"
                  required
                >
                  <option value="" disabled>Lütfen personel seçin...</option>
                  {barbers.map(barber => (
                    <option key={barber.id} value={barber.id}>{barber.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pin" className="font-semibold text-sm text-foreground">6 Haneli PIN Kodu</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="pin" 
                    type="password" 
                    maxLength={6}
                    placeholder="******"
                    className="pl-12 rounded-xl border-border py-6 text-2xl tracking-[0.5em] text-center focus-visible:ring-gold-500 focus-visible:ring-1 transition-shadow bg-secondary/20 font-mono"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold text-lg h-14 rounded-xl shadow-md hover:shadow-lg transition-all mt-6"
                disabled={loading || !selectedBarber || pin.length !== 6}
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Sisteme Gir'}
              </Button>
            </form>
          )}
          
          <div className="mt-8 text-center border-t border-border/50 pt-4">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-gold-600 transition-colors inline-flex items-center">
              <span className="mr-1">&larr;</span> Müşteri Ekranına Dön
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
