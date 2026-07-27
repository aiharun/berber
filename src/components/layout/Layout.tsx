import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Scissors, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="w-full bg-white border-b border-stone-200">
        <div className="container mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-stone-900 rounded-none flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
              <Scissors className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-widest text-stone-900 uppercase leading-none">Wid<span className="text-amber-600">Ber</span></span>
              <span className="text-[9px] sm:text-[10px] font-bold text-stone-500 tracking-[0.2em] uppercase mt-1">Premium Grooming</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-12">
            <Link to="/" className="text-sm font-bold uppercase tracking-wider text-stone-600 hover:text-stone-900 transition-colors">
              Ana Sayfa
            </Link>
            <Link to="/admin" className="text-sm font-bold uppercase tracking-wider text-stone-400 hover:text-stone-900 transition-colors">
              Yönetici
            </Link>
          </nav>

          {/* CTA Button & Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            <Link to="/booking" className="hidden sm:block">
              <button className="px-6 py-2.5 bg-stone-900 text-white text-sm font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors duration-300">
                Randevu Al
              </button>
            </Link>
            
            <button 
              className="md:hidden p-2 text-stone-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
              className="md:hidden border-t border-stone-200 bg-white"
            >
              <nav className="flex flex-col px-6 py-4 space-y-4">
                <Link to="/" className="text-sm font-bold uppercase tracking-wider text-stone-600">
                  Ana Sayfa
                </Link>
                <Link to="/admin" className="text-sm font-bold uppercase tracking-wider text-stone-400">
                  Yönetici Girişi
                </Link>
                <Link to="/booking" className="sm:hidden pt-2">
                  <button className="w-full px-6 py-3 bg-stone-900 text-white text-sm font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors duration-300">
                    Randevu Al
                  </button>
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-white py-6 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 text-sm font-medium text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} WidBer. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
