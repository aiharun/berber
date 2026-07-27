import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export type AdminAppointment = {
  id: string;
  customer_first_name: string;
  customer_last_name: string;
  phone: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  total_price: number;
  total_duration: number;
  barber_id: string | null;
  barbers?: { name: string };
  appointment_services?: {
    services?: { name: string }
  }[];
};

export const useAdminAppointments = () => {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('appointments')
        .select(`
          *,
          barbers ( name ),
          appointment_services (
            services ( name )
          )
        `)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      // Personel (admin olmayan) giriş yaptıysa, localStorage'dan barber_id'yi al
      if (!isAdmin) {
        const staffBarberId = localStorage.getItem('staff_barber_id');
        
        if (staffBarberId) {
          query = query.eq('barber_id', staffBarberId);
        } else {
          // Eğer giriş yapılmış ama ID yoksa, boş liste dönsün (güvenlik)
          setAppointments([]);
          setLoading(false);
          return;
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      if (data) setAppointments(data as any);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) {
        if (error.code === '42501') {
          alert("Yetkisiz işlem: Sadece patron (admin) randevu silebilir.");
        }
        throw error;
      }
      setAppointments(prev => prev.filter(app => app.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      return false;
    }
  };

  return { appointments, loading, updateStatus, deleteAppointment, refresh: fetchAppointments };
};
