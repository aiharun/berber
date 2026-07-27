import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md w-full bg-white p-12 rounded-3xl border border-border shadow-lg relative overflow-hidden">
        {/* Subtle decorative element */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-stone-900 rounded-full flex items-center justify-center mb-6 shadow-md">
            <Scissors className="w-10 h-10 text-white transform -rotate-45 opacity-50" />
          </div>
          
          <h1 className="text-7xl font-black text-stone-900 tracking-tighter mb-2">404</h1>
          <h2 className="text-xl font-bold uppercase tracking-widest text-gold-600 mb-4">Sayfa Bulunamadı</h2>
          
          <p className="text-muted-foreground font-medium mb-8">
            Görünüşe göre makasımız biraz fazla kaymış. Aradığınız sayfa şu anda buralarda değil.
          </p>
          
          <Link to="/" className="inline-block">
            <button className="px-8 py-3 bg-stone-900 text-white text-sm font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors duration-300 rounded-lg shadow-md hover:shadow-lg">
              Ana Sayfaya Dön
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
