import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAppointments } from '../../hooks/useAdminAppointments';
import { format, addDays, startOfDay, isSameDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const AppointmentsList = () => {
  const { appointments, loading } = useAdminAppointments();
  const navigate = useNavigate();

  // Generate 21 days for the grid calendar (3 weeks)
  const availableDates = useMemo(() => {
    const dates = [];
    let currentDate = startOfDay(new Date());
    for (let i = 0; i < 21; i++) {
      dates.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }
    return dates;
  }, []);

  // Helper to count appointments for a specific date and status
  const getCount = (date: Date, statusTypes: string[]) => {
    return appointments.filter(app => {
      const appDate = new Date(app.appointment_date);
      return isSameDay(appDate, date) && statusTypes.includes(app.status);
    }).length;
  };

  const handleDateClick = (date: Date) => {
    navigate(`/admin/appointments/${format(date, 'yyyy-MM-dd')}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-gold-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Randevu Takvimi</h1>
        <p className="text-muted-foreground mt-1">Günlere tıklayarak o güne ait randevuların detaylarını görebilirsiniz.</p>
      </div>

      {/* Legend / Bilgilendirme */}
      <div className="flex flex-wrap gap-4 items-center p-4 bg-white border border-border/60 rounded-xl shadow-sm text-sm">
        <span className="font-semibold text-muted-foreground mr-2">Renklerin Anlamı:</span>
        <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-2 shadow-sm"></div> <span className="font-medium text-green-700">Onaylanan</span></div>
        <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-yellow-500 mr-2 shadow-sm"></div> <span className="font-medium text-yellow-700">Bekleyen</span></div>
        <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-sm"></div> <span className="font-medium text-red-700">İptal/Reddedilen</span></div>
      </div>

      {/* Grid Date Picker */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {availableDates.map((date, idx) => {
          const approvedCount = getCount(date, ['approved', 'completed']);
          const pendingCount = getCount(date, ['pending']);
          const rejectedCount = getCount(date, ['cancelled', 'rejected']);
          
          const totalCount = approvedCount + pendingCount + rejectedCount;
          const isToday = isSameDay(date, new Date());

          return (
            <button
              key={idx}
              onClick={() => handleDateClick(date)}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer bg-white text-foreground hover:border-gold-500/40 hover:bg-secondary/20 hover:shadow-md",
                isToday ? "border-gold-500 shadow-sm bg-gold-500/5" : "border-border"
              )}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                {format(date, 'EEE', { locale: tr })}
              </span>
              <span className={cn("text-3xl font-black mb-4", isToday ? "text-gold-600" : "text-foreground")}>
                {format(date, 'd')}
              </span>
              
              {/* Dots with numbers */}
              <div className="flex gap-1.5 min-h-[24px]">
                {approvedCount > 0 && (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-[11px] font-bold text-white shadow-sm" title="Onaylanan">
                    {approvedCount}
                  </div>
                )}
                {pendingCount > 0 && (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500 text-[11px] font-bold text-white shadow-sm" title="Bekleyen">
                    {pendingCount}
                  </div>
                )}
                {rejectedCount > 0 && (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-[11px] font-bold text-white shadow-sm" title="İptal Edilen">
                    {rejectedCount}
                  </div>
                )}
                {totalCount === 0 && (
                  <span className="text-xs font-medium text-muted-foreground/50 flex items-center h-6">Randevu Yok</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentsList;
