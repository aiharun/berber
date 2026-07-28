import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Calendar, Clock, Scissors } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BookingWizard from './BookingWizard';
import { QuickBookingWidget } from '../../components/QuickBookingWidget';
import { X } from 'lucide-react';

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
              <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/3] md:aspect-auto md:h-[600px] border border-black/5">
                <img 
                  src="/hero-barber.png" 
                  alt="Premium Barber Shop Interior" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              {/* Subtle background glow */}
              <div className="absolute -inset-10 bg-gradient-to-tr from-gray-200 to-transparent opacity-50 blur-3xl -z-10 rounded-full"></div>
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
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
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
                className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors z-50 text-black border border-black/5"
              >
                <X className="w-6 h-6" />
              </button>
              <BookingWizard />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Home;
