import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Check, X, Clock, Loader2, Phone, Calendar as CalendarIcon, ChevronLeft, Trash2 } from 'lucide-react';
import { useAdminAppointments } from '../../hooks/useAdminAppointments';
import { useAuth } from '../../context/AuthContext';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '../../lib/utils';

const AppointmentsDayView = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { appointments, updateStatus, deleteAppointment, loading } = useAdminAppointments();
  const { isAdmin } = useAuth();

  const selectedDate = useMemo(() => {
    return date ? parseISO(date) : new Date();
  }, [date]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => app.appointment_date === date);
  }, [appointments, date]);

  const groupedAppointments = useMemo(() => {
    return filteredAppointments.reduce((acc, app) => {
      const barberName = app.barbers?.name || 'Belirtilmemiş Personel';
      if (!acc[barberName]) acc[barberName] = [];
      acc[barberName].push(app);
      return acc;
    }, {} as Record<string, typeof filteredAppointments>);
  }, [filteredAppointments]);

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatus(id, newStatus);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/appointments')}
          className="rounded-full border-border hover:bg-secondary w-10 h-10 p-0 flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center">
            <CalendarIcon className="w-6 h-6 mr-2 text-gold-500" />
            {format(selectedDate, 'd MMMM yyyy, EEEE', { locale: tr })}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Bu tarihe ait randevu detayları</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
        </div>
      ) : filteredAppointments.length === 0 ? (
        <Card className="bg-white border border-border/60 shadow-sm rounded-2xl overflow-hidden p-12 text-center mt-8">
          <p className="text-muted-foreground font-medium text-lg">Bu tarihte hiç randevu bulunmuyor.</p>
          <Button 
            onClick={() => navigate('/admin/appointments')}
            className="mt-6 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-semibold"
          >
            Takvime Geri Dön
          </Button>
        </Card>
      ) : (
        <div className="space-y-12 mt-8">
          {Object.entries(groupedAppointments).map(([barberName, apps]) => (
            <div key={barberName} className="space-y-6">
              <h2 className="text-xl font-bold border-b border-border/50 pb-2 flex items-center text-foreground">
                <span className="bg-gold-500/10 text-gold-600 px-3 py-1 rounded-lg mr-3 text-sm">{apps.length} Randevu</span>
                {barberName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {apps.map((app) => {
            const serviceNames = app.appointment_services?.map(as => as.services?.name).join(', ') || 'Bilinmiyor';
            
            const isPending = app.status === 'pending';
            const isApproved = app.status === 'approved';
            const isCompleted = app.status === 'completed';
            
            return (
              <Card key={app.id} className={cn("bg-white shadow-md hover:shadow-lg transition-all rounded-2xl overflow-hidden flex flex-col border-l-4", 
                isPending ? 'border-l-yellow-500 border-t-border/60 border-r-border/60 border-b-border/60' : 
                isApproved ? 'border-l-green-500 border-t-border/60 border-r-border/60 border-b-border/60' : 
                isCompleted ? 'border-l-blue-500 border-t-border/60 border-r-border/60 border-b-border/60' : 
                'border-l-red-500 border-t-border/60 border-r-border/60 border-b-border/60'
              )}>
                <CardHeader className="bg-secondary/20 pb-4 border-b border-border/50 flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center border border-gold-500/20">
                      <span className="font-bold text-gold-600">{app.customer_first_name.charAt(0)}{app.customer_last_name.charAt(0)}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold">{app.customer_first_name} {app.customer_last_name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{app.phone}</p>
                    </div>
                  </div>
                  
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                    ${isPending ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20' : 
                      isApproved ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 
                      isCompleted ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' : 
                      'bg-red-500/10 text-red-600 border border-red-500/20'}`}>
                    {isPending ? 'Bekliyor' : 
                     isApproved ? 'Onaylandı' : 
                     isCompleted ? 'Tamamlandı' : 'İptal'}
                  </span>
                </CardHeader>
                
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Personel:</span>
                      <span className="text-sm font-bold text-foreground">{app.barbers?.name || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Saat:</span>
                      <span className="text-sm font-bold text-gold-600 bg-gold-500/10 px-2 py-1 rounded-md">{app.appointment_time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Hizmetler:</span>
                      <span className="text-sm font-semibold text-right max-w-[60%] truncate" title={serviceNames}>{serviceNames}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-border/50">
                      <span className="text-sm font-medium text-muted-foreground">Tutar:</span>
                      <span className="text-lg font-bold text-foreground">₺{app.total_price}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-auto">
                    <a 
                      href={`tel:${app.phone}`} 
                      className="flex items-center justify-center w-full bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl h-12 font-bold transition-colors mb-2"
                    >
                      <Phone className="w-5 h-5 mr-2" /> Müşteriyi Ara
                    </a>
                    
                    {isPending && (
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl h-12 font-bold transition-colors shadow-sm"
                          onClick={() => handleStatusChange(app.id, 'approved')}
                        >
                          <Check className="w-5 h-5 mr-2" /> Onayla
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300 rounded-xl h-12 font-bold transition-colors"
                          onClick={() => handleStatusChange(app.id, 'cancelled')}
                        >
                          <X className="w-5 h-5 mr-2" /> Reddet
                        </Button>
                      </div>
                    )}
                    {isApproved && (
                      <Button 
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-12 font-bold transition-colors shadow-sm"
                        onClick={() => handleStatusChange(app.id, 'completed')}
                      >
                        <Clock className="w-5 h-5 mr-2" /> Tamamlandı Olarak İşaretle
                      </Button>
                    )}
                    {(isCompleted || app.status === 'cancelled' || app.status === 'rejected') && (
                      <div className="flex gap-2 w-full">
                        <Button 
                          variant="outline"
                          disabled
                          className="flex-1 rounded-xl h-12 font-bold bg-secondary/20 border-transparent text-muted-foreground"
                        >
                          İşlem Tamamlandı
                        </Button>
                        
                        {isAdmin && (app.status === 'cancelled' || app.status === 'rejected') && (
                          <Button 
                            variant="destructive"
                            className="rounded-xl h-12 px-4 shadow-sm"
                            onClick={() => {
                              if (window.confirm("Bu reddedilmiş randevuyu tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
                                deleteAppointment(app.id);
                              }
                            }}
                            title="Randevuyu Sil"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentsDayView;
