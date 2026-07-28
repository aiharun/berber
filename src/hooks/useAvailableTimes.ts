import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { parse, addMinutes, addDays, isToday } from 'date-fns';
import { Barber } from '../context/BookingContext';

export const useAvailableTimes = (selectedDate: string, selectedBarber: Barber | null, totalDuration: number) => {
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [fetchingTimes, setFetchingTimes] = useState(false);

  useEffect(() => {
    if (!selectedDate || !selectedBarber) return;
    
    const fetchBookedTimes = async () => {
      setFetchingTimes(true);
      try {
        const { data: appData, error: appError } = await supabase
          .from('appointments')
          .select('appointment_time, barber_id, total_duration')
          .eq('appointment_date', selectedDate)
          .in('status', ['pending', 'approved']);
          
        if (appError) throw appError;

        const { data: blockedData, error: blockedError } = await supabase
          .from('barber_blocked_times')
          .select('blocked_time, barber_id')
          .eq('blocked_date', selectedDate);

        if (blockedError) throw blockedError;
        
        const appointmentsAtDate = appData?.map(app => {
          const t = app.appointment_time;
          return {
            time: t.length > 5 ? t.substring(0, 5) : t,
            barber_id: app.barber_id,
            duration: app.total_duration || 30
          };
        }) || [];
        
        const barberWorkingHours = selectedBarber?.working_hours || [];
        const initialBlockedSlots = new Set<string>();
        
        barberWorkingHours.forEach(time => {
          const slotTime = parse(time, 'HH:mm', new Date());
          let isBlockedForSelectedBarber = false;
          
          appointmentsAtDate.forEach(app => {
            const appStartTime = parse(app.time, 'HH:mm', new Date());
            const appEndTime = addMinutes(appStartTime, app.duration);
            
            if (slotTime >= appStartTime && slotTime < appEndTime) {
              if (app.barber_id === selectedBarber.id) {
                isBlockedForSelectedBarber = true;
              }
            }
          });
          
          if (isBlockedForSelectedBarber) {
            initialBlockedSlots.add(time);
          } else {
            const isManuallyBlocked = blockedData?.some(b => b.blocked_time === time && b.barber_id === selectedBarber.id);
            if (isManuallyBlocked) {
              initialBlockedSlots.add(time);
            }
          }
        });
        
        const requiredBlocks = Math.ceil(totalDuration / 30);
        const finalBlockedSlots = new Set<string>(initialBlockedSlots);
        
        if (requiredBlocks > 1) {
          barberWorkingHours.forEach((time, index) => {
            if (finalBlockedSlots.has(time)) return;
            
            let hasEnoughRoom = true;
            for (let i = 1; i < requiredBlocks; i++) {
              const nextIndex = index + i;
              if (nextIndex >= barberWorkingHours.length || initialBlockedSlots.has(barberWorkingHours[nextIndex])) {
                hasEnoughRoom = false;
                break;
              }
            }
            
            if (!hasEnoughRoom) {
              finalBlockedSlots.add(time);
            }
          });
        }
        
        setBookedTimes(Array.from(finalBlockedSlots));
      } catch (err) {
        console.error("Dolu saatler çekilirken hata:", err);
      } finally {
        setFetchingTimes(false);
      }
    };
    
    fetchBookedTimes();
  }, [selectedDate, selectedBarber, totalDuration]);

  return { bookedTimes, fetchingTimes };
};
