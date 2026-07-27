import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Scissors, Clock, MapPin, Star, Loader2 } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { motion } from 'framer-motion';

const Home = () => {
  const { services, loading } = useSupabaseData();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center py-24 px-4 overflow-hidden border-b border-border">
        {/* Elegant subtle background */}
        <div className="absolute inset-0 bg-background z-0">
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/10 blur-[100px] rounded-full z-0 pointer-events-none"></div>

        <div className="z-10 text-center max-w-3xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-md p-10 rounded-3xl border border-white shadow-xl"
          >
            <span className="text-gold-600 font-semibold tracking-widest uppercase text-sm mb-4 block">Premium Erkek Kuaförü</span>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">
              Tarzınızı <span className="text-gold-500">Sanata</span> Dönüştürüyoruz
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Modern dokunuşlar ve usta işçilikle kendinizi özel hissedeceğiniz bir bakım deneyimi. Sıra beklemeden, hemen randevunuzu alın.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/booking">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-10 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                Hemen Randevu Al
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>



      {/* Info Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 bg-white rounded-2xl border border-border shadow-sm">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 bg-gold-500/10 text-gold-600">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Konum</h4>
              <p className="text-muted-foreground">Moda Caddesi No:123<br/>Kadıköy, İstanbul</p>
            </div>
            <div className="p-8 bg-white rounded-2xl border border-border shadow-sm">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 bg-gold-500/10 text-gold-600">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Çalışma Saatleri</h4>
              <p className="text-muted-foreground">Pazartesi - Cumartesi<br/>09:00 - 20:00</p>
            </div>
            <div className="p-8 bg-white rounded-2xl border border-border shadow-sm">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 bg-gold-500/10 text-gold-600">
                <Star className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Deneyim</h4>
              <p className="text-muted-foreground">15 Yıllık Ustalık<br/>Premium Hizmet Kalitesi</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
