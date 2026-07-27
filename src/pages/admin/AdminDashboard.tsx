import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, CalendarCheck, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAdminAppointments } from '../../hooks/useAdminAppointments';

const AdminDashboard = () => {
  const { appointments, loading } = useAdminAppointments();
  
  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayAppointments = appointments.filter(a => a.appointment_date === todayStr);
  const todayCount = todayAppointments.length;
  const todayIncome = todayAppointments.reduce((acc, curr) => acc + curr.total_price, 0);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-gold-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Özet</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bugünkü Randevular
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayCount}</div>
            <p className="text-xs text-muted-foreground">
              düne göre +2 artış
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bekleyen Onaylar
            </CardTitle>
            <Clock className="h-4 w-4 text-gold-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              onay bekleyen yeni randevu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tamamlanan</CardTitle>
            <CalendarCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              bu hafta tamamlanan
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tahmini Kazanç</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺2,450</div>
            <p className="text-xs text-muted-foreground">
              bugün için öngörülen
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Yaklaşan Randevular</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.slice(0, 10).map(app => {
                const serviceNames = app.appointment_services?.map(as => as.services?.name).join(', ') || 'Bilinmiyor';
                return (
                  <div key={app.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium leading-none">{app.customer_first_name} {app.customer_last_name}</p>
                      <p className="text-sm text-muted-foreground">{serviceNames} • {app.appointment_date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{app.appointment_time}</p>
                      <div className="flex items-center justify-end mt-1">
                        <span className={`w-2 h-2 rounded-full mr-2 ${app.status === 'pending' ? 'bg-yellow-500' : app.status === 'completed' ? 'bg-blue-500' : app.status === 'cancelled' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {app.status === 'pending' ? 'Bekliyor' : app.status === 'approved' ? 'Onaylandı' : app.status === 'cancelled' ? 'İptal' : 'Tamamlandı'}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
              {appointments.length === 0 && (
                <div className="text-center text-muted-foreground py-4">Henüz randevu bulunmamaktadır.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
