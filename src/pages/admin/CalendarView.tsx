import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addDays, format, startOfWeek, isSameDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useAdminAppointments } from '../../hooks/useAdminAppointments';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { Loader2 } from 'lucide-react';

const CalendarView = () => {
  const { appointments, loading: appointmentsLoading } = useAdminAppointments();
  const { workingHours, loading: hoursLoading } = useSupabaseData();
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const timeSlots = workingHours.length > 0 ? workingHours : ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));
  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Haftalık Takvim</h1>
          <p className="text-muted-foreground mt-1">Randevuları haftalık görünümde inceleyin ve yönetin.</p>
        </div>
        <div className="flex items-center space-x-3 bg-white border border-border/60 shadow-sm rounded-xl p-1.5">
          <Button variant="ghost" className="rounded-lg h-10 px-3 hover:bg-secondary/50" onClick={prevWeek}>
            <ChevronLeft className="h-5 w-5 mr-1" /> Önceki
          </Button>
          <div className="text-base font-bold px-4 py-2 bg-secondary/30 rounded-lg min-w-[160px] text-center">
            {format(weekStart, 'MMMM yyyy', { locale: tr })}
          </div>
          <Button variant="ghost" className="rounded-lg h-10 px-3 hover:bg-secondary/50" onClick={nextWeek}>
            Sonraki <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-auto max-h-[700px] relative">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 border-b sticky top-0 bg-white z-10 shadow-sm">
              <div className="p-4 border-r bg-secondary/30 flex items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground">Saat</span>
              </div>
              {weekDays.map((day, i) => (
                <div key={i} className={`p-4 text-center border-r last:border-r-0 bg-white ${isSameDay(day, new Date()) ? 'bg-gold-500/5' : ''}`}>
                  <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{format(day, 'EEEE', { locale: tr })}</div>
                  <div className={`text-2xl mt-1.5 font-bold ${isSameDay(day, new Date()) ? 'text-gold-600' : 'text-foreground'}`}>
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
            </div>
            
            {(appointmentsLoading || hoursLoading) ? (
              <div className="flex items-center justify-center h-[500px]">
                <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
              </div>
            ) : (
              <div className="flex flex-col">
              {timeSlots.map((time, timeIdx) => (
              <div key={timeIdx} className="grid grid-cols-8 border-b last:border-b-0 min-h-[80px]">
                <div className="p-2 border-r text-sm text-muted-foreground text-center flex items-center justify-center bg-secondary/10">
                  {time}
                </div>
                {weekDays.map((day, dayIdx) => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  // Birden fazla personelin aynı saatte randevusu olabilir, filter kullanıyoruz
                  const slotAppointments = appointments.filter(a => 
                    a.appointment_date === dateStr && a.appointment_time.slice(0, 5) === time
                  );

                  return (
                    <div key={dayIdx} className={`p-1.5 border-r last:border-r-0 flex flex-col gap-1.5 min-h-[100px] transition-colors ${isSameDay(day, new Date()) ? 'bg-gold-500/5' : 'hover:bg-secondary/10'}`}>
                      {slotAppointments.map(appointment => {
                        const serviceNames = appointment.appointment_services?.map(as => as.services?.name).join(', ') || 'Bilinmiyor';
                        const barberName = appointment.barbers?.name || 'Bilinmiyor';
                        
                        return (
                          <div key={appointment.id} className={`p-2.5 rounded-xl text-xs border shadow-sm transition-all hover:shadow-md cursor-pointer ${
                            appointment.status === 'pending' ? 'bg-yellow-50/80 border-yellow-200 text-yellow-800' :
                            appointment.status === 'approved' ? 'bg-green-50/80 border-green-200 text-green-800' :
                            appointment.status === 'completed' ? 'bg-blue-50/80 border-blue-200 text-blue-800' :
                            'bg-red-50/80 border-red-200 text-red-800'
                          }`}>
                            <div className="font-bold text-sm truncate mb-0.5">{appointment.customer_first_name} {appointment.customer_last_name}</div>
                            <div className="font-medium opacity-80 truncate">{serviceNames}</div>
                            <div className="mt-1.5 pt-1.5 border-t border-black/10 font-bold text-[10px] uppercase tracking-wider opacity-70 truncate flex justify-between">
                              <span>{barberName}</span>
                              <span>₺{appointment.total_price}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
