import { useWorkerRequests, useUpdateRequestStatus } from '@/hooks/useSupabaseData';
import { StatusBadge } from '@/components/StatusBadge';
import { MapPin, Calendar, IndianRupee, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const RequestsInbox = () => {
  const { data: requests = [], isLoading } = useWorkerRequests();
  const updateStatus = useUpdateRequestStatus();

  const pending = requests.filter(r => r.status === 'worker_assigned' || r.status === 'pending');

  const handleAction = async (id: string, action: 'accept' | 'reject') => {
    try {
      await updateStatus.mutateAsync({
        id,
        status: action === 'accept' ? 'worker_accepted' : 'cancelled',
      });
      toast.success(action === 'accept' ? 'Job accepted!' : 'Job rejected.');
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Requests Inbox</h1>
        <p className="text-muted-foreground">Review and respond to job requests</p>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">Loading...</div>
      ) : pending.length === 0 ? (
        <div className="bg-card rounded-xl p-10 shadow-card text-center">
          <p className="text-muted-foreground">No pending requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl p-5 shadow-card border border-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{r.category_name}</h3>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{r.location}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{r.start_date || 'TBD'}</span>
                <span className="capitalize">{r.shift_type} shift · {r.duration}</span>
                <span className="flex items-center gap-1.5"><IndianRupee className="w-3.5 h-3.5" />₹{r.salary_offer.toLocaleString()}/mo</span>
              </div>
              {r.notes && <p className="text-sm text-muted-foreground mb-4 bg-muted rounded-lg p-3">"{r.notes}"</p>}
              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => handleAction(r.id, 'accept')} disabled={updateStatus.isPending}>
                  <Check className="w-4 h-4 mr-2" /> Accept
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => handleAction(r.id, 'reject')} disabled={updateStatus.isPending}>
                  <X className="w-4 h-4 mr-2" /> Reject
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsInbox;
