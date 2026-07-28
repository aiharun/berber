import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Scissors, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { format, addDays, isToday, parse } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { useAvailableTimes } from '../hooks/useAvailableTimes';
import { useBooking } from '../context/BookingContext';
import { cn } from '../lib/utils';

interface QuickBookingWidgetProps {
  onComplete: () => void;
}

export const QuickBookingWidget: React.FC<QuickBookingWidgetProps> = ({ onComplete }) => {
  const { services, barbers, loading } = useSupabaseData();
  const { appointment, setServices, setBarber, setDateTime } = useBooking();
  
  const [activePopover, setActivePopover] = useState<'service' | 'barber' | 'date' | 'time' | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Local selections mapped to Context
  const selectedService = appointment.services[0] || null;
  const selectedBarber = appointment.barber || null;
  const selectedDate = appointment.date ? format(appointment.date, 'yyyy-MM-dd') : null;
  const selectedTime = appointment.time || null;

  const totalDuration = selectedService ? selectedService.duration : 0;
  
  const { bookedTimes, fetchingTimes } = useAvailableTimes(
    selectedDate || '', 
    selectedBarber, 
    totalDuration
  );

  // Generate 14 days
  const availableDates = Array.from({ length: 14 }).map((_, i) => addDays(new Date(), i));

  // Click outside to close popovers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setActivePopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNext = () => {
    if (selectedService && selectedBarber && selectedDate && selectedTime) {
      onComplete(); // Opens the modal for Contact Info
    } else {
      // Auto open next missing step
      if (!selectedService) setActivePopover('service');
      else if (!selectedBarber) setActivePopover('barber');
      else if (!selectedDate) setActivePopover('date');
      else if (!selectedTime) setActivePopover('time');
    }
  };

  if (loading) {
    return <div className="h-24 w-full flex items-center justify-center bg-white/80 rounded-3xl"><Loader2 className="animate-spin text-gray-400" /></div>;
  }

  return (
    <div ref={widgetRef} className="relative bg-white/80 backdrop-blur-xl p-4 md:p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 flex flex-col md:flex-row items-center gap-4">
      
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
        
        {/* SERVICE */}
        <div className="relative">
          <button 
            onClick={() => setActivePopover(activePopover === 'service' ? null : 'service')}
            className={cn("w-full flex items-center space-x-3 p-3 rounded-2xl transition-colors text-left border", activePopover === 'service' ? 'bg-black text-white border-black' : 'bg-[#F5F5F7] hover:bg-[#EBEBEF] border-transparent group')}
          >
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shadow-sm", activePopover === 'service' ? 'bg-white/20' : 'bg-white')}>
              <Scissors className={cn("w-4 h-4", activePopover === 'service' ? 'text-white' : 'text-gray-600 group-hover:text-black')} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className={cn("text-[11px] font-semibold uppercase tracking-wide", activePopover === 'service' ? 'text-gray-300' : 'text-gray-500')}>Hizmet</span>
              <span className="text-[13px] font-medium truncate">{selectedService ? selectedService.name : 'Seçiniz'}</span>
            </div>
          </button>
          
          <AnimatePresence>
            {activePopover === 'service' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 w-64 mt-2 p-2 bg-white rounded-2xl shadow-xl border border-black/5 z-50">
                <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                  {services.map(srv => (
                    <button key={srv.id} onClick={() => { setServices([srv]); setActivePopover('barber'); }} className="w-full text-left p-3 rounded-xl hover:bg-gray-50 flex justify-between items-center transition-colors">
                      <span className="font-medium text-sm text-gray-800">{srv.name}</span>
                      <span className="text-xs text-gray-400 font-semibold">{srv.duration} Dk</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BARBER */}
        <div className="relative">
          <button 
            onClick={() => setActivePopover(activePopover === 'barber' ? null : 'barber')}
            className={cn("w-full flex items-center space-x-3 p-3 rounded-2xl transition-colors text-left border", activePopover === 'barber' ? 'bg-black text-white border-black' : 'bg-[#F5F5F7] hover:bg-[#EBEBEF] border-transparent group')}
          >
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shadow-sm", activePopover === 'barber' ? 'bg-white/20' : 'bg-white')}>
              <User className={cn("w-4 h-4", activePopover === 'barber' ? 'text-white' : 'text-gray-600 group-hover:text-black')} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className={cn("text-[11px] font-semibold uppercase tracking-wide", activePopover === 'barber' ? 'text-gray-300' : 'text-gray-500')}>Personel</span>
              <span className="text-[13px] font-medium truncate">{selectedBarber ? selectedBarber.name : 'Seçiniz'}</span>
            </div>
          </button>
          
          <AnimatePresence>
            {activePopover === 'barber' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 w-56 mt-2 p-2 bg-white rounded-2xl shadow-xl border border-black/5 z-50">
                <div className="space-y-1">
                  {barbers.map(barber => (
                    <button key={barber.id} onClick={() => { setBarber(barber); setActivePopover('date'); if (appointment.date) setDateTime(appointment.date, ''); }} className="w-full text-left p-3 rounded-xl hover:bg-gray-50 flex items-center space-x-3 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">{barber.name.charAt(0)}</div>
                      <span className="font-medium text-sm text-gray-800">{barber.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* DATE */}
        <div className="relative">
          <button 
            onClick={() => setActivePopover(activePopover === 'date' ? null : 'date')}
            className={cn("w-full flex items-center space-x-3 p-3 rounded-2xl transition-colors text-left border", activePopover === 'date' ? 'bg-black text-white border-black' : 'bg-[#F5F5F7] hover:bg-[#EBEBEF] border-transparent group')}
          >
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shadow-sm", activePopover === 'date' ? 'bg-white/20' : 'bg-white')}>
              <CalendarIcon className={cn("w-4 h-4", activePopover === 'date' ? 'text-white' : 'text-gray-600 group-hover:text-black')} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className={cn("text-[11px] font-semibold uppercase tracking-wide", activePopover === 'date' ? 'text-gray-300' : 'text-gray-500')}>Tarih</span>
              <span className="text-[13px] font-medium truncate">{selectedDate ? format(new Date(selectedDate), 'dd MMM') : 'Seçiniz'}</span>
            </div>
          </button>
          
          <AnimatePresence>
            {activePopover === 'date' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-[280px] mt-2 p-3 bg-white rounded-2xl shadow-xl border border-black/5 z-50">
                <div className="grid grid-cols-4 gap-2">
                  {availableDates.map(date => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const isSel = selectedDate === dateStr;
                    return (
                      <button key={dateStr} onClick={() => { setDateTime(date, ''); setActivePopover('time'); }} className={cn("flex flex-col items-center p-2 rounded-xl border transition-all text-center", isSel ? "border-black bg-black text-white" : "border-black/5 hover:border-black/20")}>
                        <span className="text-[10px] uppercase opacity-70 mb-1">{format(date, 'EEE', { locale: tr })}</span>
                        <span className="text-lg font-bold leading-none">{format(date, 'd')}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* TIME */}
        <div className="relative">
          <button 
            onClick={() => setActivePopover(activePopover === 'time' ? null : 'time')}
            className={cn("w-full flex items-center space-x-3 p-3 rounded-2xl transition-colors text-left border", activePopover === 'time' ? 'bg-black text-white border-black' : 'bg-[#F5F5F7] hover:bg-[#EBEBEF] border-transparent group')}
          >
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shadow-sm", activePopover === 'time' ? 'bg-white/20' : 'bg-white')}>
              <Clock className={cn("w-4 h-4", activePopover === 'time' ? 'text-white' : 'text-gray-600 group-hover:text-black')} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className={cn("text-[11px] font-semibold uppercase tracking-wide", activePopover === 'time' ? 'text-gray-300' : 'text-gray-500')}>Saat</span>
              <span className="text-[13px] font-medium truncate">{selectedTime || 'Seçiniz'}</span>
            </div>
          </button>
          
          <AnimatePresence>
            {activePopover === 'time' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 w-[300px] mt-2 p-4 bg-white rounded-2xl shadow-xl border border-black/5 z-50">
                {!selectedBarber || !selectedDate ? (
                  <div className="text-center py-4 text-sm text-gray-500 font-medium">Lütfen önce personel ve tarih seçin.</div>
                ) : fetchingTimes ? (
                  <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {selectedBarber.working_hours?.map(time => {
                      const isSel = selectedTime === time;
                      let isBooked = bookedTimes.includes(time);
                      if (!isBooked && selectedDate) {
                        const dateObj = new Date(selectedDate);
                        if (isToday(dateObj)) {
                          let timeDate = parse(time, 'HH:mm', new Date());
                          if (timeDate.getHours() < 6) timeDate = addDays(timeDate, 1);
                          if (timeDate < new Date()) isBooked = true;
                        }
                      }
                      if (isBooked) {
                        return (
                          <button key={time} disabled className="py-2 text-center text-xs font-semibold rounded-lg bg-gray-50 text-gray-400 line-through opacity-50 cursor-not-allowed border border-gray-100">{time}</button>
                        );
                      }
                      return (
                        <button key={time} onClick={() => { setDateTime(new Date(selectedDate), time); setActivePopover(null); }} className={cn("py-2 text-center text-xs font-semibold rounded-lg transition-colors border", isSel ? "bg-black text-white border-black" : "bg-white text-gray-800 border-black/10 hover:border-black/30 hover:bg-gray-50")}>{time}</button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
      
      {/* SUBMIT BUTTON */}
      <button 
        onClick={handleNext} 
        className={cn("w-full md:w-auto mt-2 md:mt-0 md:ml-2 h-14 md:h-[68px] md:w-[68px] rounded-2xl flex items-center justify-center transition-all shadow-sm group", 
          (selectedService && selectedBarber && selectedDate && selectedTime) 
          ? "bg-black text-white hover:scale-105 active:scale-95" 
          : "bg-gray-200 text-gray-400"
        )}
      >
        <ArrowRight className={cn("w-6 h-6", (selectedService && selectedBarber && selectedDate && selectedTime) ? "group-hover:translate-x-1 transition-transform" : "")} />
      </button>

    </div>
  );
};
