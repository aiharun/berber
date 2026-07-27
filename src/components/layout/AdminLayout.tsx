import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Home, LogOut, Scissors, User, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const location = useLocation();
  const { signOut, isAdmin, staffBarber } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    ...(isAdmin ? [{ icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' }] : []),
    { icon: Users, label: 'Randevular', path: '/admin/appointments' },
    ...(isAdmin ? [{ icon: Scissors, label: 'Hizmetler', path: '/admin/services' }] : []),
    ...(isAdmin ? [{ icon: User, label: 'Personeller', path: '/admin/barbers' }] : []),
    { icon: Clock, label: 'Müsaitlik', path: '/admin/availability' },
    { icon: Calendar, label: 'Takvim', path: '/admin/calendar' },
  ];

  return (
    <div className="flex min-h-screen bg-secondary/10">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/60 bg-white px-4 py-6 hidden md:flex flex-col shadow-sm">
        <div className="mb-8 px-2 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Admin<span className="text-gold-600">Panel</span></h2>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2.5 transition-all font-medium",
                  isActive 
                    ? "bg-gold-500/10 text-gold-700" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-4 border-t border-border/60">
          <div className="mb-4 px-3 py-2 flex items-center space-x-3 bg-secondary/30 rounded-xl border border-border/50">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-border/80 shadow-sm">
              <User className="w-5 h-5 text-gold-600" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-foreground truncate">
                {isAdmin ? 'Patron' : staffBarber?.name || 'Personel'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {isAdmin ? 'Yönetici Hesabı' : 'Personel Hesabı'}
              </p>
            </div>
          </div>
          
          <Link to="/" className="flex items-center space-x-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
             <Home className="h-5 w-5" />
             <span>Siteye Dön</span>
          </Link>
          <div className="mt-2">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2 w-full rounded-lg text-sm font-medium transition-colors text-red-500 hover:bg-red-500/10"
            >
              <LogOut className="w-5 h-5" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col pb-20 md:pb-0"> {/* Mobile padding for bottom nav */}
        <header className="h-16 border-b border-border/60 bg-white flex items-center justify-between px-6 md:hidden shadow-sm sticky top-0 z-10">
           <h2 className="text-xl font-bold tracking-tight text-foreground">Admin<span className="text-gold-600">Panel</span></h2>
           <button onClick={handleLogout} className="text-red-500 p-2">
             <LogOut className="w-5 h-5" />
           </button>
        </header>
        <div className="p-4 md:p-8 flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border/60 flex items-center justify-around px-2 py-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center p-2 min-w-[60px] rounded-xl transition-all",
                isActive 
                  ? "text-gold-600 bg-gold-50" 
                  : "text-muted-foreground hover:bg-secondary/50"
              )}
            >
              <item.icon className={cn("h-5 w-5 mb-1", isActive && "fill-gold-600/20")} />
              <span className="text-[10px] font-bold tracking-tight truncate w-full text-center">{item.label}</span>
            </Link>
          );
        })}
        <Link
          to="/"
          className="flex flex-col items-center justify-center p-2 min-w-[60px] rounded-xl transition-all text-muted-foreground hover:bg-secondary/50"
        >
          <Home className="h-5 w-5 mb-1" />
          <span className="text-[10px] font-bold tracking-tight truncate w-full text-center">Site</span>
        </Link>
      </nav>
    </div>
  );
};

export default AdminLayout;
