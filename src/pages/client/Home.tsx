import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Star, ArrowRight, Instagram, Twitter } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { motion, useAnimation, useInView } from 'framer-motion';
import { cn } from '../../lib/utils';

// Helper component for fade-in animations on scroll
const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: "easeOut" } }
      }}
      initial="hidden"
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {
  const { services, barbers, loading } = useSupabaseData();

  return (
    <div className="flex flex-col min-h-screen bg-stone-950 text-stone-50 selection:bg-gold-500 selection:text-stone-950">
      
      {/* 1. HERO SECTION - Full screen, brutalist dark theme */}
      <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden border-b-8 border-gold-500">
        {/* Background Image with heavy dark overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80" 
            alt="Barbershop" 
            className="w-full h-full object-cover object-center opacity-40 grayscale-[30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/40"></div>
          <div className="absolute inset-0 bg-stone-950/30 mix-blend-multiply"></div>
        </div>

        <div className="container mx-auto px-6 z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[2px] w-12 bg-gold-500"></div>
              <span className="font-sans font-bold tracking-[0.3em] uppercase text-gold-500 text-sm md:text-base">Premium Barbershop</span>
            </div>
            
            <h1 className="font-display font-black text-6xl sm:text-7xl md:text-9xl uppercase leading-[0.9] tracking-tighter text-white mb-8 drop-shadow-2xl">
              TARZINI <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
                YARAT.
              </span>
            </h1>
            
            <p className="font-sans text-stone-400 text-lg md:text-2xl max-w-2xl mb-12 font-medium leading-relaxed">
              Sıradanlığı reddet. Şehrin merkezinde brutalist ve lüks bir atmosferde usta makasların dokunuşunu hisset.
            </p>
            
            <Link to="/booking">
              <button className="group relative inline-flex items-center justify-center bg-gold-500 text-stone-950 px-8 py-5 font-bold font-sans tracking-widest uppercase overflow-hidden shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)] transition-all hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.08)] hover:-translate-y-1 active:translate-y-1 active:shadow-none">
                <span className="relative z-10 flex items-center gap-3">
                  Hemen Randevu Al <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 h-full w-full bg-gold-400 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out"></div>
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. SERVICES SECTION - Asymmetric Modern Grid */}
      <section className="py-24 md:py-32 bg-stone-950 relative border-b border-stone-800">
        <div className="container mx-auto px-6">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="font-display font-black text-5xl md:text-7xl uppercase text-white tracking-tighter">Hizmetler</h2>
                <div className="w-24 h-2 bg-gold-500 mt-4"></div>
              </div>
              <p className="font-sans text-stone-400 max-w-md font-medium text-lg">
                Klasik berber algısını yıkıyoruz. İhtiyacın olan her şey, en keskin detaylarla tasarlandı.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            {loading ? (
              <div className="col-span-12 flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* Featured Large Service */}
                {services[0] && (
                  <FadeIn className="md:col-span-7 group cursor-pointer" delay={0.1}>
                    <div className="bg-stone-900 border border-stone-800 h-full p-8 md:p-12 relative overflow-hidden transition-colors hover:bg-stone-800">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-gold-500/10 transition-colors"></div>
                      <Scissors className="w-16 h-16 text-gold-500 mb-8 opacity-50 group-hover:opacity-100 transition-opacity" />
                      <h3 className="font-display font-bold text-4xl md:text-5xl uppercase text-white mb-4">{services[0].name}</h3>
                      <div className="flex items-end justify-between mt-12">
                        <span className="font-sans font-bold text-stone-400 text-lg">{services[0].duration} Dakika</span>
                        <span className="font-display font-black text-4xl text-gold-500">₺{services[0].price}</span>
                      </div>
                    </div>
                  </FadeIn>
                )}

                {/* Right Stack Services */}
                <div className="md:col-span-5 flex flex-col gap-6 md:gap-8">
                  {services.slice(1, 3).map((service, idx) => (
                    <FadeIn key={service.id} delay={0.2 + (idx * 0.1)} className="flex-1 group cursor-pointer">
                      <div className="bg-stone-900 border border-stone-800 h-full p-8 relative overflow-hidden transition-colors hover:border-gold-500/50">
                        <h3 className="font-display font-bold text-3xl uppercase text-white mb-2 group-hover:text-gold-500 transition-colors">{service.name}</h3>
                        <div className="flex items-center gap-4 mt-6">
                          <span className="bg-stone-950 border border-stone-800 px-4 py-2 font-sans font-bold text-sm text-stone-300">{service.duration} Dk</span>
                          <span className="font-display font-black text-2xl text-white">₺{service.price}</span>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>

                {/* Bottom Wide Services */}
                {services.slice(3, 5).map((service, idx) => (
                  <FadeIn key={service.id} delay={0.4 + (idx * 0.1)} className="md:col-span-6 group cursor-pointer">
                    <div className="bg-stone-900/50 border border-stone-800 h-full p-8 flex items-center justify-between hover:bg-gold-500 hover:border-gold-500 transition-all">
                      <div>
                        <h3 className="font-display font-bold text-2xl uppercase text-white group-hover:text-stone-950">{service.name}</h3>
                        <span className="font-sans font-medium text-stone-500 group-hover:text-stone-800 block mt-1">{service.duration} Dk</span>
                      </div>
                      <span className="font-display font-black text-3xl text-gold-500 group-hover:text-stone-950">₺{service.price}</span>
                    </div>
                  </FadeIn>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* 3. BARBERS SECTION - Horizontal Scroll */}
      <section className="py-24 md:py-32 bg-stone-900 overflow-hidden">
        <div className="container mx-auto px-6 mb-16">
          <FadeIn>
            <h2 className="font-display font-black text-5xl md:text-7xl uppercase text-white tracking-tighter">Ekibimiz</h2>
            <div className="w-24 h-2 bg-gold-500 mt-4"></div>
          </FadeIn>
        </div>

        {/* Carousel Container */}
        <div className="w-full px-6 md:px-12">
          <div className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {barbers.map((barber, idx) => (
              <FadeIn key={barber.id} delay={idx * 0.1} className="snap-center shrink-0">
                <div className="w-[280px] md:w-[320px] flex flex-col items-center group">
                  {/* Avatar */}
                  <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden mb-6 border-4 border-stone-800 group-hover:border-gold-500 transition-colors relative">
                    <div className="absolute inset-0 bg-stone-800 flex items-center justify-center">
                      {/* Fallback avatar if no image */}
                      <span className="font-display font-black text-6xl text-stone-700">{barber.name.charAt(0)}</span>
                    </div>
                    {/* Fake image for visual effect (Can be replaced with real avatar from DB later) */}
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${barber.name}&backgroundColor=1c1917`} 
                      alt={barber.name}
                      className="w-full h-full object-cover relative z-10 grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  
                  <h3 className="font-display font-bold text-3xl uppercase text-white text-center">{barber.name}</h3>
                  <div className="flex items-center justify-center gap-1 mt-2 text-gold-500">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  
                  {/* Social Icons */}
                  <div className="flex gap-4 mt-6">
                    <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-gold-500 hover:text-stone-950 transition-colors">
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-gold-500 hover:text-stone-950 transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA Banner */}
      <section className="bg-gold-500 py-20 px-6 text-center">
        <FadeIn>
          <h2 className="font-display font-black text-4xl md:text-6xl uppercase text-stone-950 tracking-tighter mb-8">
            BEKLEMEK SİZE GÖRE DEĞİL Mİ?
          </h2>
          <Link to="/booking">
            <button className="bg-stone-950 text-white font-sans font-bold uppercase tracking-widest px-10 py-5 hover:bg-stone-800 transition-colors shadow-2xl">
              Randevunu Hemen Al
            </button>
          </Link>
        </FadeIn>
      </section>

    </div>
  );
};

export default Home;
