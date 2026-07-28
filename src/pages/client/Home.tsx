import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Calendar, Clock, Scissors } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BookingWizard from './BookingWizard';
import { QuickBookingWidget } from '../../components/QuickBookingWidget';
import { X, Loader2, Check } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { supabase } from '../../lib/supabase';

const REVIEWS = [
  {
    id: 1,
    name: "Can Yılmaz",
    text: "Minimalist tasarımı ve profesyonel hizmetiyle benzersiz bir deneyim. Kesinlikle tavsiye ederim.",
    rating: 5
  },
  {
    id: 2,
    name: "Kaan Tekin",
    text: "Sıra beklemeden, tam saatinde hizmet almak harika. Atmosfer inanılmaz derecede ferah ve temiz.",
    rating: 5
  },
  {
    id: 3,
    name: "Emre Şahin",
    text: "Sadece saç kesimi değil, tam bir bakım seansı. Yeni favori mekanım.",
    rating: 5
  }
];

const FastBookingModal = ({ onClose }: { onClose: () => void }) => {
  const { appointment, resetAppointment } = useBooking();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const totalPrice = appointment.services.reduce((acc, curr) => acc + curr.price, 0);
      const totalDuration = appointment.services.reduce((acc, curr) => acc + curr.duration, 0);
      
      const { data: appData, error: appError } = await supabase
        .from('appointments')
        .insert([{
          customer_first_name: firstName,
          customer_last_name: lastName,
          phone: phone,
          appointment_date: appointment.date,
          appointment_time: appointment.time,
          barber_id: appointment.barber?.id,
          total_price: totalPrice,
          total_duration: totalDuration
        }])
        .select()
        .single();
        
      if (appError) throw appError;

      if (appData) {
        const serviceMappings = appointment.services.map(s => ({
          appointment_id: appData.id,
          service_id: s.id
        }));
        await supabase.from('appointment_services').insert(serviceMappings);
      }
      
      setSuccess(true);
      setTimeout(() => {
        resetAppointment();
        onClose();
      }, 3000);
    } catch (error) {
      console.error(error);
      alert('Bir hata oluştu, lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-[2rem] p-8 max-w-md w-full mx-auto text-center shadow-2xl relative overflow-hidden border border-black/5">
        <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Check className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Harika!</h2>
        <p className="text-gray-500 font-medium leading-relaxed">Randevunuz başarıyla oluşturuldu. Sizi bekliyor olacağız.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] p-6 md:p-8 max-w-md w-full mx-auto shadow-2xl relative border border-black/5">
      <h2 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">İletişim Bilgileri</h2>
      <p className="text-gray-500 text-sm mb-8 font-medium">Randevuyu tamamlamak için lütfen bilgilerinizi girin.</p>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Ad</label>
            <input required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-[#F5F5F7] border border-transparent rounded-xl px-4 py-3.5 text-[15px] font-medium focus:bg-white focus:border-black/20 focus:outline-none transition-all" placeholder="Adınız" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Soyad</label>
            <input required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-[#F5F5F7] border border-transparent rounded-xl px-4 py-3.5 text-[15px] font-medium focus:bg-white focus:border-black/20 focus:outline-none transition-all" placeholder="Soyadınız" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Telefon</label>
          <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-[#F5F5F7] border border-transparent rounded-xl px-4 py-3.5 text-[15px] font-medium focus:bg-white focus:border-black/20 focus:outline-none transition-all tracking-wider" placeholder="05XX XXX XX XX" />
        </div>
        
        <button disabled={loading} type="submit" className="w-full bg-black text-white rounded-xl py-4 font-semibold text-[15px] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center mt-4 shadow-md">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Randevuyu Onayla'}
        </button>
      </form>
    </div>
  );
};

const Home = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            
            {/* Text Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-1/2 space-y-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#1D1D1F] leading-[1.1]">
                Kusursuz Görünüm. <br />
                <span className="text-gray-400">Zahmetsiz Deneyim.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-500 font-medium max-w-lg leading-relaxed">
                Modern erkeğin ihtiyaçlarına özel tasarlanmış premium bakım alanı. Şehrin karmaşasından uzaklaşın, tarzınızı sanatla buluşturun.
              </p>
            </motion.div>

            {/* Hero Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/3] md:aspect-auto md:h-[600px] border border-black/5 bg-gray-100">
                <img 
                  src="/hero-barber.png" 
                  alt="Premium Barber Shop Interior" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Functional Quick Booking Module */}
      <section className="relative -mt-8 md:-mt-16 z-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <QuickBookingWidget onComplete={() => setIsBookingOpen(true)} />
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-32 px-6 bg-white mt-20 border-t border-black/5">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1D1D1F]">Müşterilerimizin Gözünden</h2>
            <p className="text-gray-500 text-lg font-medium">Binlerce mutlu misafir, sıfır bekleme süresi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((review, idx) => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="p-8 rounded-[2rem] bg-[#FAFAFA] border border-black/5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all flex flex-col h-full"
              >
                <div className="flex space-x-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-black text-black" />
                  ))}
                </div>
                <p className="text-[#1D1D1F] text-[17px] font-medium leading-relaxed mb-8 flex-1">
                  "{review.text}"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="font-semibold text-gray-600 text-sm">{review.name.charAt(0)}</span>
                  </div>
                  <span className="font-semibold text-sm text-gray-500">{review.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60"
              onClick={() => setIsBookingOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-h-screen overflow-y-auto pt-16 md:pt-0"
            >
              <button 
                onClick={() => setIsBookingOpen(false)}
                className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 active:scale-95 transition-all z-50 text-black border border-black/5"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center justify-center min-h-screen px-4 pb-20 md:pb-0">
                <FastBookingModal onClose={() => setIsBookingOpen(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Home;
