import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Scissors, Menu, X, MapPin } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-stone-950 text-stone-50">
      <header className="w-full bg-stone-950 border-b border-stone-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-white rounded-none flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <Scissors className="h-6 w-6 text-stone-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-3xl font-display font-black tracking-widest text-white uppercase leading-none">Wid<span className="text-gold-500">Ber</span></span>
              <span className="text-[9px] sm:text-[10px] font-bold text-stone-400 tracking-[0.3em] uppercase mt-1">Premium Grooming</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-12">
            <Link to="/" className="text-sm font-bold uppercase tracking-widest text-stone-300 hover:text-gold-500 transition-colors">
              Ana Sayfa
            </Link>
            <Link to="/admin" className="text-sm font-bold uppercase tracking-widest text-stone-500 hover:text-white transition-colors">
              Yönetici
            </Link>
          </nav>

          {/* CTA Button & Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            <Link to="/booking" className="hidden sm:block">
              <button className="px-8 py-3 bg-gold-500 text-stone-950 text-sm font-bold uppercase tracking-widest hover:bg-gold-400 transition-colors duration-300 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] active:translate-y-1 active:shadow-none">
                Randevu Al
              </button>
            </Link>
            
            <button 
              className="md:hidden p-2 text-white hover:text-gold-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-stone-800 bg-stone-900"
            >
              <nav className="flex flex-col px-6 py-6 space-y-6">
                <Link to="/" className="text-sm font-bold uppercase tracking-widest text-stone-300 hover:text-gold-500">
                  Ana Sayfa
                </Link>
                <Link to="/admin" className="text-sm font-bold uppercase tracking-widest text-stone-500 hover:text-white">
                  Yönetici Girişi
                </Link>
                <Link to="/booking" className="sm:hidden pt-4 border-t border-stone-800">
                  <button className="w-full px-6 py-4 bg-gold-500 text-stone-950 text-sm font-bold uppercase tracking-widest">
                    Randevu Al
                  </button>
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 bg-stone-50 text-stone-950">
        <Outlet />
      </main>

      <footer className="bg-stone-950 border-t border-stone-900 py-12">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-2xl font-display font-black tracking-widest text-white uppercase mb-2">Wid<span className="text-gold-500">Ber</span></span>
            <p className="text-stone-500 text-sm font-medium tracking-wide text-center md:text-left max-w-xs">
              Klasik dokunuşlar, modern bir görünüm. Şehrin en iyi brutalist berber deneyimi.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <a 
              href="https://goo.gl/maps/example" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center text-stone-400 hover:text-gold-500 transition-colors text-sm font-semibold tracking-wider"
            >
              <MapPin className="w-4 h-4 mr-2" /> Moda Caddesi No:123, Kadıköy
            </a>
            <p className="text-stone-600 text-xs mt-4">
              &copy; {new Date().getFullYear()} WidBer. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
