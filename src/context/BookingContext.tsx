import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Service = {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
};

export interface Barber {
  id: string;
  name: string;
  pin?: string;
  working_hours?: string[];
};

export type AppointmentData = {
  services: Service[];
  barber: Barber | null;
  date: Date | null;
  time: string | null;
  customerInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  } | null;
};

type BookingContextType = {
  appointment: AppointmentData;
  setServices: (services: Service[]) => void;
  setBarber: (barber: Barber | null) => void;
  setDateTime: (date: Date, time: string) => void;
  setCustomerInfo: (info: AppointmentData['customerInfo']) => void;
  resetAppointment: () => void;
};

const initialState: AppointmentData = {
  services: [],
  barber: null,
  date: null,
  time: null,
  customerInfo: null,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [appointment, setAppointment] = useState<AppointmentData>(initialState);

  const setServices = (services: Service[]) => {
    setAppointment((prev) => ({ ...prev, services }));
  };

  const setBarber = (barber: Barber | null) => {
    setAppointment((prev) => ({ ...prev, barber }));
  };

  const setDateTime = (date: Date, time: string) => {
    setAppointment((prev) => ({ ...prev, date, time }));
  };

  const setCustomerInfo = (info: AppointmentData['customerInfo']) => {
    setAppointment((prev) => ({ ...prev, customerInfo: info }));
  };

  const resetAppointment = () => {
    setAppointment(initialState);
  };

  return (
    <BookingContext.Provider
      value={{
        appointment,
        setServices,
        setBarber,
        setDateTime,
        setCustomerInfo,
        resetAppointment,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
