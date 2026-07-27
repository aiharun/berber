import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  staffBarber: { id: string, name: string } | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [staffBarber, setStaffBarber] = useState<{ id: string, name: string } | null>(null);

  const checkStaffBarber = async (currentUser: User | null) => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@widber.com';
    if (currentUser && currentUser.email !== adminEmail) {
      const staffId = localStorage.getItem('staff_barber_id');
      if (staffId) {
        const { data } = await supabase.from('barbers').select('id, name').eq('id', staffId).single();
        if (data) {
          setStaffBarber(data);
        }
      }
    } else {
      setStaffBarber(null);
    }
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      checkStaffBarber(currentUser);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      checkStaffBarber(currentUser);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    localStorage.removeItem('staff_barber_id');
    setStaffBarber(null);
    await supabase.auth.signOut();
  };

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@widber.com';
  const isAdmin = user?.email === adminEmail;

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, staffBarber, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
