import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  Home, Search, FileText, Bell, User, Shield, ClipboardList,
  MapPin, Clock, Users, BarChart3, Settings, LogOut, Menu, X,
  ChevronRight, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = {
  customer: [
    { label: 'Home', icon: Home, path: '/customer' },
    { label: 'Search Workers', icon: Search, path: '/customer/search' },
    { label: 'My Requests', icon: FileText, path: '/customer/requests' },
    { label: 'Notifications', icon: Bell, path: '/customer/notifications' },
    { label: 'Profile', icon: User, path: '/customer/profile' },
    { label: 'Support', icon: MessageSquare, path: '/customer/support' },
  ],
  worker: [
    { label: 'Home', icon: Home, path: '/worker' },
    { label: 'Requests', icon: ClipboardList, path: '/worker/requests' },
    { label: 'Attendance', icon: Clock, path: '/worker/attendance' },
    { label: 'My Jobs', icon: FileText, path: '/worker/jobs' },
    { label: 'Profile', icon: User, path: '/worker/profile' },
  ],
  admin: [
    { label: 'Dashboard', icon: Home, path: '/admin' },
    { label: 'Workers', icon: Shield, path: '/admin/workers' },
    { label: 'Customers', icon: Users, path: '/admin/customers' },
    { label: 'Requests', icon: ClipboardList, path: '/admin/requests' },
    { label: 'Attendance', icon: Clock, path: '/admin/attendance' },
    { label: 'Tracking', icon: MapPin, path: '/admin/tracking' },
    { label: 'Reports', icon: BarChart3, path: '/admin/reports' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ],
};

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;
  const items = navItems[user.role];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-200 lg:relative lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-lg gradient-accent flex items-center justify-center">
            <Shield className="w-5 h-5 text-accent-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate">Hanvika</p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">{user.role} Panel</p>
          </div>
          <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )}
              >
                <item.icon className="w-4.5 h-4.5 shrink-0" />
                {item.label}
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={async () => { await logout(); navigate('/'); }}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
          >
            <LogOut className="w-4.5 h-4.5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-4 shrink-0">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="relative" onClick={() => navigate(user.role === 'admin' ? '/admin' : `/${user.role}/notifications`)}>
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">{user.name.charAt(0)}</span>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
