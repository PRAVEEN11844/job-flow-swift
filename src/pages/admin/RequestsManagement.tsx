import { useState } from 'react';
import { useAllRequests, useWorkerProfiles, useUpdateRequestStatus } from '@/hooks/useSupabaseData';
import { StatusBadge } from '@/components/StatusBadge';
import { Search, Filter, UserPlus, MapPin, Calendar, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const RequestsManagement = () => {
  const { data: requests = [], isLoading } = useAllRequests();
  const { data: workers = [] } = useWorkerProfiles({ availability: 'available' });
  const updateStatus = useUpdateRequestStatus();
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const filtered = requests.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (search && !r.category_name.toLowerCase().includes(search.toLowerCase()) && !r.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAssign = async (requestId: string, workerId: string) => {
    const worker = workers.find(w => w.user_id === workerId);
    try {
      await updateStatus.mutateAsync({ id: requestId, status: 'worker_assigned', assigned_worker_id: workerId });
      setAssigningId(null);
      toast.success('Worker assigned to request');
    } catch (err: any) {
      toast.error(err.message || 'Failed to assign worker');
    }
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

      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">Loading...</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="bg-card rounded-xl p-5 shadow-card border border-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{r.category_name}</h3>
                  <p className="text-sm text-muted-foreground">#{r.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{r.location}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{r.start_date || 'TBD'}</span>
                <span className="capitalize">{r.shift_type} · {r.duration}</span>
                <span>₹{r.salary_offer.toLocaleString()}/mo</span>
              </div>

              {(r.status === 'pending' || r.status === 'admin_reviewing') && (
                <div>
                  {assigningId === r.id ? (
                    <div className="bg-muted rounded-lg p-3 space-y-2">
                      <p className="text-sm font-medium">Select a worker to assign:</p>
                      <div className="space-y-1.5">
                        {workers.map(w => (
                          <button key={w.id} onClick={() => handleAssign(r.id, w.user_id)}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-card transition-colors text-sm text-left">
                            <span>{(w as any).profiles?.name || 'Worker'} — {w.experience} yrs — ₹{w.expected_salary.toLocaleString()}</span>
                            <UserPlus className="w-3.5 h-3.5 text-primary" />
                          </button>
                        ))}
                        {workers.length === 0 && <p className="text-xs text-muted-foreground">No available workers</p>}
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
          {filtered.length === 0 && <div className="text-center py-10 text-muted-foreground">No requests found</div>}
        </div>
      )}
    </div>
  );
};

export default RequestsManagement;
