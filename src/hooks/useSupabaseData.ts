import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Service, Barber } from '../context/BookingContext';

export const useSupabaseData = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [workingHours, setWorkingHours] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .order('created_at', { ascending: true });
        
        if (servicesError) throw servicesError;
        if (servicesData) setServices(servicesData);

        // Fetch barbers
        const { data: barbersData, error: barbersError } = await supabase
          .from('barbers')
          .select('*')
          .order('created_at', { ascending: true });
        
        if (barbersError) throw barbersError;
        
        if (barbersData) {
          setBarbers(barbersData);
        }

        // Fetch settings (working hours)
        const { data: settingsData, error: settingsError } = await supabase
          .from('settings')
          .select('*')
          .eq('key', 'working_hours')
          .single();
        
        if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
        if (settingsData && settingsData.value) {
          setWorkingHours(settingsData.value);
        } else {
          // Fallback if not found
          setWorkingHours([
            "10:00", "10:45", "11:30", "12:15", "13:00", 
            "13:45", "14:30", "15:15", "16:00", "16:45", 
            "17:30", "18:15", "19:00", "19:45", "20:30", "21:15", "22:00", "22:45", "23:30", "00:00"
          ]);
        }

      } catch (error) {
        console.error('Error fetching data from Supabase:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { services, barbers, workingHours, loading };
};
