import { mockRequests } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const MyRequests = () => {
  const requests = mockRequests.filter(r => r.customerId === 'c1');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Requests</h1>
          <p className="text-muted-foreground">Track the status of your worker requests</p>
        </div>
        <Link to="/customer/request">
          <Button><Plus className="w-4 h-4 mr-2" /> New Request</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {requests.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl p-5 shadow-card border border-border">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{r.category}</h3>
                <p className="text-sm text-muted-foreground">#{r.id.toUpperCase()}</p>
              </div>
              <StatusBadge status={r.status} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{r.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                {r.startDate}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="capitalize">{r.shiftType} shift</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                ₹{r.salaryOffer.toLocaleString()}/mo
              </div>
            </div>
            {r.assignedWorkerName && (
              <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-primary" />
                <span className="text-sm font-medium text-primary">{r.assignedWorkerName}</span>
                <span className="text-xs text-muted-foreground">assigned</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyRequests;
