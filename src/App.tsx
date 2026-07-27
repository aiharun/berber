import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import Home from './pages/client/Home';
import BookingWizard from './pages/client/BookingWizard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AppointmentsList from './pages/admin/AppointmentsList';
import AppointmentsDayView from './pages/admin/AppointmentsDayView';
import CalendarView from './pages/admin/CalendarView';
import ServicesManagement from './pages/admin/ServicesManagement';
import BarbersManagement from './pages/admin/BarbersManagement';
import AvailabilityManagement from './pages/admin/AvailabilityManagement';
import Login from './pages/admin/Login';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import NotFound from './pages/NotFound';
import { AuthProvider, useAuth } from './context/AuthContext';

const AdminIndexRedirect = () => {
  const { isAdmin } = useAuth();
  return <Navigate to={isAdmin ? "/admin/dashboard" : "/admin/appointments"} replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
        <Routes>
          {/* Client Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="booking" element={<BookingWizard />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminIndexRedirect />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="appointments" element={<AppointmentsList />} />
            <Route path="appointments/:date" element={<AppointmentsDayView />} />
            <Route path="services" element={<ServicesManagement />} />
            <Route path="barbers" element={<BarbersManagement />} />
            <Route path="availability" element={<AvailabilityManagement />} />
            <Route path="calendar" element={<CalendarView />} />
            </Route>
          </Route>

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
