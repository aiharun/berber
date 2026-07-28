import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Calendar, Clock, Scissors } from 'lucide-react';
import { motion } from 'framer-motion';

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

      {/* Quick Booking Module */}
      <section className="relative -mt-8 md:-mt-16 z-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 flex flex-col md:flex-row items-center gap-6"
          >
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {/* Fake Inputs that navigate to actual booking */}
              <Link to="/booking" className="flex items-center space-x-4 p-4 rounded-2xl bg-[#F5F5F7] hover:bg-[#EBEBEF] transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Calendar className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide">Tarih</span>
                  <span className="text-[15px] font-medium text-black">Bugün</span>
                </div>
              </Link>
              
              <Link to="/booking" className="flex items-center space-x-4 p-4 rounded-2xl bg-[#F5F5F7] hover:bg-[#EBEBEF] transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Clock className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide">Saat</span>
                  <span className="text-[15px] font-medium text-black">Seçiniz</span>
                </div>
              </Link>

              <Link to="/booking" className="flex items-center space-x-4 p-4 rounded-2xl bg-[#F5F5F7] hover:bg-[#EBEBEF] transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Scissors className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide">Hizmet</span>
                  <span className="text-[15px] font-medium text-black">Seçiniz</span>
                </div>
              </Link>
            </div>
            
            <Link to="/booking" className="w-full md:w-auto">
              <button className="w-full md:w-16 h-16 rounded-2xl bg-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md group">
                <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
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

    </div>
  );
};

export default Home;
