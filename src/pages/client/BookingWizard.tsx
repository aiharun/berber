import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useBooking, Service, Barber } from '../../context/BookingContext';
import { Check, ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock, User, AlertCircle, Loader2 } from 'lucide-react';
import { ConfirmModal } from '../../components/ui/confirm-modal';
import { cn } from '../../lib/utils';
import { addDays, format, getDay, startOfDay, isToday, parse, addMinutes } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { useAvailableTimes } from '../../hooks/useAvailableTimes';
import { supabase } from '../../lib/supabase';
import emailjs from '@emailjs/browser';

const STEPS = [
  { id: 1, title: 'Hizmet Seçimi' },
  { id: 2, title: 'Personel' },
  { id: 3, title: 'Tarih & Saat' },
  { id: 4, title: 'Bilgiler' },
  { id: 5, title: 'Onay' },
];

const BookingWizard = () => {
  const { services: SERVICES, barbers: BARBERS, loading } = useSupabaseData();
  const navigate = useNavigate();
  const { appointment, setServices, setBarber, setDateTime, setCustomerInfo, resetAppointment } = useBooking();
  const [currentStep, setCurrentStep] = useState(() => {
    // Auto-advance if previous steps are already filled
    if (appointment.services.length > 0 && appointment.barber && appointment.date && appointment.time) return 4;
    return 1;
  });
  const [selectedServices, setSelectedServices] = useState<Service[]>(appointment.services);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(appointment.barber);
  const [selectedDate, setSelectedDate] = useState<string>(appointment.date ? format(appointment.date, 'yyyy-MM-dd') : '');
  const [selectedTime, setSelectedTime] = useState<string | null>(appointment.time);
  
  // Form state
  const [firstName, setFirstName] = useState(appointment.customerInfo?.firstName || '');
  const [lastName, setLastName] = useState(appointment.customerInfo?.lastName || '');
  const [phone, setPhone] = useState(appointment.customerInfo?.phone || '');
  const [email, setEmail] = useState(appointment.customerInfo?.email || '');

  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'danger' | 'warning' | 'success';
    title: string;
    description: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    description: ''
  });

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
    if (modalState.type === 'success') {
      navigate('/');
    }
  };


  // İhtiyaç duyulan toplam süre
  const totalDuration = selectedServices.reduce((acc, curr) => acc + curr.duration, 0);
  const totalPrice = selectedServices.reduce((acc, curr) => acc + curr.price, 0);

  const { bookedTimes, fetchingTimes } = useAvailableTimes(selectedDate, selectedBarber, totalDuration);

  // Scroll handling
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scrollDates = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Generate dates
  const availableDates = React.useMemo(() => {
    const dates = [];
    let currentDate = startOfDay(new Date());
    let daysAdded = 0;
    
    while (daysAdded < 18) {
      if (getDay(currentDate) !== 0) { // 0 is Sunday
        dates.push(currentDate);
        daysAdded++;
      }
      currentDate = addDays(currentDate, 1);
    }
    return dates;
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ''); // Sadece rakamlar
    if (val.startsWith('90')) val = val.substring(2); // 90 ile başlarsa at
    if (val.length > 0 && val[0] !== '0') val = '0' + val; // Her zaman 0 ile başla
    if (val.length > 11) val = val.substring(0, 11); // En fazla 11 hane
    setPhone(val);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setServices(selectedServices);
    } else if (currentStep === 2) {
      setBarber(selectedBarber);
    } else if (currentStep === 3) {
      if (selectedDate && selectedTime) {
        setDateTime(new Date(selectedDate), selectedTime);
      }
    } else if (currentStep === 4) {
      if (!email || !email.includes('@')) {
        setModalState({ isOpen: true, type: 'danger', title: 'Hata', description: 'Lütfen geçerli bir e-posta adresi girin.' });
        return;
      }
      setCustomerInfo({ firstName, lastName, phone, email });
    }
    
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const toggleService = (service: Service) => {
    if (selectedServices.find(s => s.id === service.id)) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleRequestOtp = async () => {
    if (!email || !email.includes('@')) return;
    
    // Test/Admin emaili için OTP atlama
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@widber.com';
    if (email.toLowerCase() === adminEmail.toLowerCase()) {
      console.log(`[TEST MODU] Admin emaili tespit edildi, OTP atlanıyor.`);
      handleConfirm();
      return;
    }

    setIsSubmitting(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (serviceId && templateId && publicKey) {
      try {
        await emailjs.send(
          serviceId,
          templateId,
          {
            to_email: email,
            to_name: `${firstName} ${lastName}`,
            otp_code: code,
            appointment_date: selectedDate ? new Date(selectedDate).toLocaleDateString('tr-TR') : '',
            appointment_time: selectedTime || '',
            barber_name: selectedBarber?.name || '',
            services_list: selectedServices.map(s => s.name).join(', ')
          },
          publicKey
        );
        console.log(`[EmailJS] OTP e-postası başarıyla gönderildi: ${email}`);
      } catch (error: any) {
        console.error('E-posta gönderilemedi:', error);
        const errorDetail = error?.text || error?.message || 'Bilinmeyen hata';
        setModalState({ isOpen: true, type: 'danger', title: 'Hata', description: `E-posta gönderilemedi. Detay: ${errorDetail}` });
        setIsSubmitting(false);
        return;
      }
    } else {
      // MOCK EMAIL SENDING
      console.log(`[SIMÜLASYON] ${email} adresine gönderilen kod:`, code);
      alert(`(GELİŞTİRİCİ NOTU) .env dosyasında EmailJS ayarları eksik. Simülasyon Kodu: ${code}`);
    }

    setOtpSent(true);
    setIsSubmitting(false);
    
    setModalState({ 
      isOpen: true, 
      type: 'success', 
      title: 'Kod Gönderildi', 
      description: '6 haneli doğrulama kodu e-posta adresinize gönderildi. Lütfen Spam (Gereksiz) klasörünüzü kontrol etmeyi unutmayın.' 
    });
  };

  const handleVerifyOtp = () => {
    if (enteredOtp === generatedOtp) {
      handleConfirm();
    } else {
      setModalState({ isOpen: true, type: 'danger', title: 'Hata', description: 'Hatalı veya eksik kod girdiniz.' });
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      // 1. Create Appointment
      const { data: appData, error: appError } = await supabase
        .from('appointments')
        .insert([{
          customer_first_name: firstName,
          customer_last_name: lastName,
          phone: phone,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          barber_id: selectedBarber?.id,
          total_price: totalPrice,
          total_duration: totalDuration
        }])
        .select()
        .single();
        
      if (appError) throw appError;

      // 2. Insert Services mapping
      if (appData) {
        const serviceMappings = selectedServices.map(s => ({
          appointment_id: appData.id,
          service_id: s.id
        }));
        
        const { error: mappingError } = await supabase
          .from('appointment_services')
          .insert(serviceMappings);
          
        if (mappingError) throw mappingError;
      }

      setIsSubmitting(false);
      setModalState({
        isOpen: true,
        type: 'success',
        title: 'Randevu Onaylandı',
        description: 'Randevunuz başarıyla oluşturuldu! Sizi bekliyoruz.'
      });
      // Context'i temizle
      setSelectedServices([]);
      setSelectedBarber(null);
      setSelectedDate('');
      setSelectedTime(null);
      resetAppointment();
    } catch (err) {
      console.error("Randevu oluşturulurken hata:", err);
      setModalState({
        isOpen: true,
        type: 'danger',
        title: 'Hata',
        description: 'Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.'
      });
      setIsSubmitting(false);
    }
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case 1: return selectedServices.length === 0;
      case 2: return selectedBarber === null;
      case 3: return !selectedDate || !selectedTime;
      case 4: return !firstName || !lastName || phone.length !== 11 || !phone.startsWith('05');
      default: return false;
    }
  };

  return (
    <div className="min-h-screen py-16 px-6 bg-[#FAFAFA]">
      <div className="max-w-3xl mx-auto">
        {/* Progress Tracker */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {STEPS.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mb-2 transition-colors",
                  currentStep === step.id ? "bg-black text-white shadow-md" : 
                  currentStep > step.id ? "bg-black/5 text-gray-800" : "bg-white border border-border text-muted-foreground"
                )}>
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span className="text-xs text-muted-foreground hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-black transition-all duration-300 ease-in-out"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Container */}
        <Card className="bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden min-h-[400px] flex flex-col relative">
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
               <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
          )}
          <div className="p-6 md:p-8 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {/* STEP 1: Services */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">Hizmet Seçimi</h2>
                    <div className="grid gap-4">
                      {SERVICES.map(service => {
                        const isSelected = selectedServices.some(s => s.id === service.id);
                        return (
                          <div 
                            key={service.id}
                            onClick={() => toggleService(service)}
                            className={cn(
                              "p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center group",
                              isSelected ? "border-black bg-black/5 shadow-sm" : "border-border bg-white hover:border-black/10 hover:shadow-sm"
                            )}
                          >
                            <div>
                              <h3 className="font-semibold text-lg text-foreground">{service.name}</h3>
                              <p className="text-sm font-medium text-muted-foreground">{service.duration} Dk</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="font-bold text-lg text-foreground">₺{service.price}</span>
                              <div className={cn(
                                "w-6 h-6 rounded-full border flex items-center justify-center transition-colors",
                                isSelected ? "border-black bg-black text-white" : "border-border bg-secondary"
                              )}>
                                {isSelected && <Check className="w-4 h-4" />}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 2: Barber */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">Personel Seçimi</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {BARBERS.map(barber => {
                        const isSelected = selectedBarber?.id === barber.id;
                        return (
                          <div 
                            key={barber.id}
                            onClick={() => setSelectedBarber(barber)}
                            className={cn(
                              "p-4 rounded-xl border cursor-pointer transition-all flex items-center space-x-4",
                              isSelected ? "border-black bg-black/5 shadow-sm" : "border-border bg-white hover:border-black/10 hover:shadow-sm"
                            )}
                          >
                            <div className="w-12 h-12 rounded-full border border-border bg-secondary flex items-center justify-center text-muted-foreground">
                              <User className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{barber.name}</h3>
                            </div>
                            <div className={cn(
                                "w-6 h-6 rounded-full border flex items-center justify-center transition-colors",
                                isSelected ? "border-black bg-black text-white" : "border-border bg-secondary"
                              )}>
                                {isSelected && <Check className="w-4 h-4" />}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 3: Date & Time */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">Tarih ve Saat Seçimi</h2>
                    <div className="space-y-6">
                      <div>
                        <Label className="mb-3 block font-semibold text-foreground text-sm">Tarih Seçin</Label>
                        <div className="relative group">
                          {/* Left Gradient & Arrow */}
                          <div className="absolute left-0 top-0 bottom-2 w-16 bg-gradient-to-r from-white to-transparent z-10 flex items-center justify-start pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="secondary" 
                              size="icon" 
                              className="w-10 h-10 rounded-full border border-border shadow-sm pointer-events-auto bg-white hover:bg-secondary text-foreground"
                              onClick={(e) => { e.preventDefault(); scrollDates('left'); }}
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div 
                            ref={scrollRef}
                            className="flex overflow-x-auto space-x-3 pb-2 [&::-webkit-scrollbar]:hidden scroll-smooth snap-x"
                          >
                            {availableDates.map(date => {
                              const dateStr = format(date, 'yyyy-MM-dd');
                              const isSelected = selectedDate === dateStr;
                              return (
                                <button
                                  key={dateStr}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedDate(dateStr);
                                    setSelectedTime(null);
                                  }}
                                  className={cn(
                                    "snap-center flex-shrink-0 flex flex-col items-center justify-center p-3 rounded-xl border transition-all min-w-[90px]",
                                    isSelected ? "border-black bg-black text-white shadow-md" : "border-border bg-white text-foreground hover:border-black/10 hover:shadow-sm"
                                  )}
                                >
                                  <span className={cn("text-xs font-medium uppercase mb-1", isSelected ? "text-white/90" : "text-muted-foreground")}>{format(date, 'EEEE', { locale: tr })}</span>
                                  <span className="text-2xl font-bold">{format(date, 'd')}</span>
                                  <span className={cn("text-[10px] font-semibold mt-1 uppercase", isSelected ? "text-white/90" : "text-muted-foreground")}>{format(date, 'MMMM', { locale: tr })}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Right Gradient & Arrow */}
                          <div className="absolute right-0 top-0 bottom-2 w-16 bg-gradient-to-l from-white to-transparent z-10 flex items-center justify-end pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="secondary" 
                              size="icon" 
                              className="w-10 h-10 rounded-full border border-border shadow-sm pointer-events-auto bg-white hover:bg-secondary text-foreground"
                              onClick={(e) => { e.preventDefault(); scrollDates('right'); }}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {selectedDate && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: 'auto' }}
                          className="pt-4 border-t border-border"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <Label className="block font-semibold text-foreground text-sm">Müsait Saatler</Label>
                            {fetchingTimes && <Loader2 className="w-4 h-4 animate-spin text-black" />}
                          </div>
                          
                          {(!selectedBarber?.working_hours || selectedBarber.working_hours.length === 0) ? (
                            <div className="text-center py-8 text-muted-foreground bg-secondary/20 rounded-xl">
                              Bu personelin çalışma saati tanımlanmamış.
                            </div>
                          ) : (
                            (() => {
                              const hasAvailableSlots = selectedBarber.working_hours.some(time => {
                                let isBooked = bookedTimes.includes(time);
                                if (!isBooked && selectedDate) {
                                  const dateObj = new Date(selectedDate);
                                  if (isToday(dateObj)) {
                                    let timeDate = parse(time, 'HH:mm', new Date());
                                    if (timeDate.getHours() < 6) timeDate = addDays(timeDate, 1);
                                    if (timeDate < new Date()) isBooked = true;
                                  }
                                }
                                return !isBooked;
                              });

                              if (!hasAvailableSlots && !fetchingTimes) {
                                return (
                                  <div className="space-y-4">
                                    <div className="text-center py-4 font-semibold text-red-500 bg-red-50 rounded-xl border border-red-100 flex flex-col items-center gap-2">
                                      <AlertCircle className="w-6 h-6 opacity-80" />
                                      <span className="text-sm">Personel bu tarihte tamamen doludur.</span>
                                    </div>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 opacity-60 pointer-events-none">
                                      {selectedBarber.working_hours.map(time => (
                                        <div key={time} className="py-2.5 px-3 rounded-xl border border-red-100 bg-red-50/50 text-red-400 font-medium text-center text-sm">
                                          <span className="line-through">{time}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                  {selectedBarber.working_hours.map(time => {
                                    const isSelected = selectedTime === time;
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
                                        <button
                                          key={time}
                                          disabled
                                          className="py-2.5 px-3 rounded-xl border border-red-100 bg-red-50/40 text-red-400 font-medium text-center text-sm cursor-not-allowed opacity-70 flex items-center justify-center relative overflow-hidden"
                                        >
                                          <span className="line-through">{time}</span>
                                        </button>
                                      );
                                    }

                                    return (
                                      <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={cn(
                                          "py-2.5 px-3 rounded-xl border font-medium transition-all text-center text-sm",
                                          isSelected 
                                            ? "border-black bg-black text-white shadow-md" 
                                            : "border-border bg-white text-foreground hover:border-black/10 hover:shadow-sm"
                                        )}
                                      >
                                        {time}
                                      </button>
                                    );
                                  })}
                                </div>
                              );
                            })()
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 4: Info */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">İletişim Bilgileri</h2>
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="font-semibold text-sm">Ad</Label>
                          <Input 
                            id="firstName" 
                            placeholder="Adınız" 
                            className="rounded-lg border-border focus-visible:ring-black focus-visible:ring-1 py-5"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="font-semibold text-sm">Soyad</Label>
                          <Input 
                            id="lastName" 
                            placeholder="Soyadınız" 
                            className="rounded-lg border-border focus-visible:ring-black focus-visible:ring-1 py-5"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-semibold text-sm">E-posta Adresi</Label>
                        <Input 
                          id="email" 
                          type="email"
                          placeholder="ornek@mail.com" 
                          className="rounded-lg border-border focus-visible:ring-black focus-visible:ring-1 py-5"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Randevu onay kodunuz bu e-posta adresine gönderilecektir.</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="font-semibold text-sm">Telefon Numarası</Label>
                        <Input 
                          id="phone" 
                          type="tel"
                          placeholder="05XX XXX XX XX" 
                          className="rounded-lg border-border focus-visible:ring-black focus-visible:ring-1 py-5 tracking-wider"
                          value={phone}
                          onChange={handlePhoneChange}
                        />
                        {phone.length > 0 && (phone.length !== 11 || !phone.startsWith('05')) && (
                          <p className="text-xs text-red-500 font-medium">Lütfen başında 0 ile birlikte 11 haneli (05...) numaranızı girin.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: Summary */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">Randevu Özeti</h2>
                    
                    <div className="bg-secondary/30 border border-border/50 rounded-2xl p-6 space-y-6 shadow-sm">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Müşteri</h4>
                          <p className="font-semibold text-lg">{firstName} {lastName}</p>
                          <p className="text-sm font-medium text-foreground/80">{phone}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Personel</h4>
                          <p className="font-semibold text-lg">{selectedBarber?.name}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Tarih & Saat</h4>
                          <p className="font-semibold text-lg flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-2 text-gray-800" />
                            {selectedDate && new Date(selectedDate).toLocaleDateString('tr-TR')}
                          </p>
                          <p className="font-semibold text-lg flex items-center mt-1">
                            <Clock className="w-4 h-4 mr-2 text-gray-800" />
                            {selectedTime}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-border/60 pt-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Hizmetler</h4>
                        <div className="space-y-2">
                          {selectedServices.map(s => (
                            <div key={s.id} className="flex justify-between text-sm font-medium">
                              <span>{s.name} <span className="text-muted-foreground ml-1">({s.duration} dk)</span></span>
                              <span>₺{s.price}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between font-bold text-xl border-t border-border/60 mt-4 pt-4">
                          <span>Toplam</span>
                          <span className="text-gray-800">₺{totalPrice}</span>
                        </div>
                        <p className="text-xs font-medium text-muted-foreground mt-1">Toplam Süre: {totalDuration} Dakika</p>
                      </div>
                    </div>

                    <div className="bg-#F5F5F7 border border-black/5 rounded-xl p-4 flex items-start space-x-3 text-sm">
                      <AlertCircle className="w-5 h-5 text-gray-800 shrink-0 mt-0.5" />
                      <p className="text-gray-900">
                        <strong className="block mb-1 font-semibold">Ödeme Bilgisi</strong>
                        Sistem üzerinden herhangi bir ücret alınmamaktadır. Ödemenizi hizmet bitiminde dükkanda yapabilirsiniz.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-border/50 bg-secondary/20 flex justify-between items-center mt-auto">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={currentStep === 1}
              className={cn("rounded-full font-semibold border-border hover:bg-secondary transition-all", currentStep === 1 ? 'invisible' : '')}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Geri
            </Button>
            
            {currentStep < 5 ? (
              <Button 
                onClick={handleNext} 
                disabled={isNextDisabled()}
                className="rounded-full bg-black hover:bg-gray-800 text-white font-semibold transition-all px-8 disabled:opacity-50"
              >
                İleri
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : !otpSent ? (
              <Button 
                onClick={handleRequestOtp}
                className="rounded-full bg-black hover:bg-gray-800 text-white font-semibold transition-all px-10 shadow-md hover:shadow-lg"
              >
                Doğrulama Kodu Gönder
                <Check className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <Input 
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
                  placeholder="6 Haneli Kod" 
                  className="w-32 text-center tracking-widest font-bold border-black/20"
                />
                <Button 
                  onClick={handleVerifyOtp}
                  disabled={isSubmitting || enteredOtp.length !== 6}
                  className="rounded-full bg-stone-900 hover:bg-stone-800 text-white font-semibold transition-all px-8 shadow-md"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Randevuyu Tamamla'}
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
      
      <ConfirmModal 
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={closeModal}
        title={modalState.title}
        description={modalState.description}
        type={modalState.type}
        confirmText="Tamam"
        cancelText=""
      />
    </div>
  );
};

export default BookingWizard;
