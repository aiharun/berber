import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FAFAFA] text-[#1D1D1F]">
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/80 backdrop-blur-md border-b border-black/5 py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <span className="text-2xl font-semibold tracking-tight">
              WidBer<span className="text-gray-400">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link to="/" className="text-[15px] font-medium text-gray-500 hover:text-black transition-colors">
              Ana Sayfa
            </Link>
            <Link to="/booking" className="text-[15px] font-medium text-gray-500 hover:text-black transition-colors">
              Hizmetler
            </Link>
            <Link to="/admin" className="text-[15px] font-medium text-gray-500 hover:text-black transition-colors">
              Yönetici
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/admin" className="text-[15px] font-medium text-black hover:opacity-70 transition-opacity">
              Giriş Yap
            </Link>
            <Link to="/booking">
              <button className="px-5 py-2.5 bg-black text-white text-[15px] font-medium rounded-full hover:scale-105 active:scale-95 transition-transform">
                Randevu Al
              </button>
            </Link>
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 -mr-2 text-black"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-black/5 p-6 md:hidden shadow-2xl"
            >
              <nav className="flex flex-col space-y-6 text-center">
                <Link to="/" className="text-lg font-medium text-gray-800">Ana Sayfa</Link>
                <Link to="/admin" className="text-lg font-medium text-gray-800">Yönetici</Link>
                <Link to="/admin" className="text-lg font-medium text-gray-800">Giriş Yap</Link>
                <Link to="/booking">
                  <button className="w-full py-4 bg-black text-white text-lg font-medium rounded-2xl">
                    Randevu Al
                  </button>
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 pt-24">
        <Outlet />
      </main>

      <footer className="bg-[#FAFAFA] border-t border-black/5 py-12 mt-20">
        <div className="container mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-gray-500 font-medium">
          <p>&copy; {new Date().getFullYear()} WidBer. Tüm hakları saklıdır.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-black transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-black transition-colors">Kullanım Şartları</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
