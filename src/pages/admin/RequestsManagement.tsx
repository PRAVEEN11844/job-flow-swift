import { useState } from 'react';
import { mockRequests, mockWorkers } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { Search, Filter, UserPlus, MapPin, Calendar, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ServiceRequest, RequestStatus } from '@/types';

const RequestsManagement = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([...mockRequests]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const filtered = requests.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (search && !r.customerName.toLowerCase().includes(search.toLowerCase()) && !r.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAssign = (requestId: string, workerId: string) => {
    const worker = mockWorkers.find(w => w.id === workerId);
    if (!worker) return;
    setRequests(prev => prev.map(r =>
      r.id === requestId ? { ...r, status: 'worker_assigned' as RequestStatus, assignedWorkerId: workerId, assignedWorkerName: worker.name } : r
    ));
    setAssigningId(null);
    toast.success(`${worker.name} assigned to request`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Requests Management</h1>
        <p className="text-muted-foreground">{requests.length} total requests</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><Filter className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="admin_reviewing">Reviewing</SelectItem>
            <SelectItem value="worker_assigned">Assigned</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filtered.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="bg-card rounded-xl p-5 shadow-card border border-border">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{r.customerName}</h3>
                <p className="text-sm text-muted-foreground">{r.category} · #{r.id.toUpperCase()}</p>
              </div>
              <StatusBadge status={r.status} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{r.location}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{r.startDate}</span>
              <span className="capitalize">{r.shiftType} · {r.duration}</span>
              <span>₹{r.salaryOffer.toLocaleString()}/mo</span>
            </div>
            {r.assignedWorkerName && (
              <p className="text-sm mb-3"><span className="text-muted-foreground">Assigned:</span> <span className="font-medium text-primary">{r.assignedWorkerName}</span></p>
            )}

            {(r.status === 'pending' || r.status === 'admin_reviewing') && (
              <div>
                {assigningId === r.id ? (
                  <div className="bg-muted rounded-lg p-3 space-y-2">
                    <p className="text-sm font-medium">Select a worker to assign:</p>
                    <div className="space-y-1.5">
                      {mockWorkers.filter(w => w.availability === 'available' && w.category === r.category).map(w => (
                        <button key={w.id} onClick={() => handleAssign(r.id, w.id)}
                          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-card transition-colors text-sm text-left">
                          <span>{w.name} — {w.experience} yrs — ₹{w.expectedSalary.toLocaleString()}</span>
                          <UserPlus className="w-3.5 h-3.5 text-primary" />
                        </button>
                      ))}
                      {mockWorkers.filter(w => w.availability === 'available' && w.category === r.category).length === 0 && (
                        <p className="text-xs text-muted-foreground">No available workers in this category</p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setAssigningId(null)}>
                      <X className="w-3 h-3 mr-1" /> Cancel
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" onClick={() => setAssigningId(r.id)}>
                    <UserPlus className="w-4 h-4 mr-2" /> Assign Worker
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RequestsManagement;
