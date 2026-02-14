import { mockRequests, mockWorkers, mockAttendance } from '@/data/mockData';
import { Users, Shield, ClipboardList, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatusBadge } from '@/components/StatusBadge';

const stats = [
  { label: 'Total Workers', value: '1,247', icon: Shield, change: '+12 this week' },
  { label: 'Total Customers', value: '523', icon: Users, change: '+5 this week' },
  { label: 'Active Requests', value: '48', icon: ClipboardList, change: '8 pending' },
  { label: 'Today Attendance', value: '89%', icon: Clock, change: '3 missed' },
];

const AdminDashboard = () => {
  const recentRequests = mockRequests.slice(0, 5);
  const pendingCount = mockRequests.filter(r => r.status === 'pending' || r.status === 'admin_reviewing').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your manpower operations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl p-5 shadow-card border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Alerts */}
      {pendingCount > 0 && (
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-accent shrink-0" />
          <div>
            <p className="text-sm font-medium">{pendingCount} requests need attention</p>
            <p className="text-xs text-muted-foreground">Review and assign workers to pending requests</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <div className="bg-card rounded-xl shadow-card border border-border">
          <div className="p-5 border-b border-border">
            <h2 className="font-semibold">Recent Requests</h2>
          </div>
          <div className="divide-y divide-border">
            {recentRequests.map(r => (
              <div key={r.id} className="p-4 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{r.customerName} — {r.category}</p>
                  <p className="text-xs text-muted-foreground">{r.location}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Today's Attendance */}
        <div className="bg-card rounded-xl shadow-card border border-border">
          <div className="p-5 border-b border-border">
            <h2 className="font-semibold">Today's Attendance</h2>
          </div>
          <div className="divide-y divide-border">
            {mockAttendance.map(a => (
              <div key={a.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{a.workerName}</p>
                  <p className="text-xs text-muted-foreground">
                    In: {a.checkIn ? new Date(a.checkIn).toLocaleTimeString() : '—'} · Out: {a.checkOut ? new Date(a.checkOut).toLocaleTimeString() : '—'}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${a.status === 'checked-out' ? 'bg-success/15 text-success' : 'bg-info/15 text-info'}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Worker Overview */}
      <div className="bg-card rounded-xl shadow-card border border-border">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold">Worker Availability</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-success/10">
              <p className="text-2xl font-bold text-success">{mockWorkers.filter(w => w.availability === 'available').length}</p>
              <p className="text-xs text-muted-foreground mt-1">Available</p>
            </div>
            <div className="p-4 rounded-lg bg-warning/10">
              <p className="text-2xl font-bold text-warning">{mockWorkers.filter(w => w.availability === 'busy').length}</p>
              <p className="text-xs text-muted-foreground mt-1">Busy</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold text-muted-foreground">{mockWorkers.filter(w => w.availability === 'unavailable').length}</p>
              <p className="text-xs text-muted-foreground mt-1">Unavailable</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
