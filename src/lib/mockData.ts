import { Barber, Service } from "../context/BookingContext";

export const SERVICES: Service[] = [
  { id: '1', name: 'Saç Kesimi', duration: 30, price: 200 },
  { id: '2', name: 'Sakal Tıraşı', duration: 20, price: 100 },
  { id: '3', name: 'Saç & Sakal Kesimi', duration: 45, price: 280 },
  { id: '4', name: 'Cilt Bakımı', duration: 30, price: 150 },
  { id: '5', name: 'Saç Yıkama ve Şekillendirme', duration: 15, price: 80 },
];

export const BARBERS: Barber[] = [
  { id: 'any', name: 'Farketmez' },
  { id: 'b1', name: 'Ahmet Yılmaz' },
  { id: 'b2', name: 'Mehmet Kaya' },
  { id: 'b3', name: 'Canberk Demir' },
];

export const MOCK_APPOINTMENTS = [
  {
    id: 'a1',
    customerName: 'Ali Veli',
    phone: '05551234567',
    serviceNames: 'Saç & Sakal Kesimi',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    status: 'pending', // pending, approved, completed, cancelled
  },
  {
    id: 'a2',
    customerName: 'Ayşe Fatma',
    phone: '05559876543',
    serviceNames: 'Cilt Bakımı',
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
    status: 'approved',
  }
];
