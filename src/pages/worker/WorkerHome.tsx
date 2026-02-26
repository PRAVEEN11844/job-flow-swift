import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkerRequests, useWorkerProfile } from '@/hooks/useSupabaseData';
import { StatusBadge } from '@/components/StatusBadge';
import { Shield, ClipboardList, Clock, MapPin, ToggleLeft, ToggleRight, User, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const WorkerHome = () => {
  const { user } = useAuth();
  const { data: workerProfile } = useWorkerProfile();
  const { data: requests = [] } = useWorkerRequests();
  const [toggling, setToggling] = useState(false);

  const activeJob = requests.find(r => r.status === 'active');
  const available = workerProfile?.availability === 'available';

  const toggleAvailability = async () => {
    if (!workerProfile) return;
    setToggling(true);
    const newStatus = available ? 'unavailable' : 'available';
    const { error } = await supabase.from('worker_profiles').update({ availability: newStatus }).eq('id', workerProfile.id);
    if (error) toast.error('Failed to update availability');
    else toast.success(`Status set to ${newStatus}`);
    setToggling(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hello, {user?.name || 'Worker'}</h1>
          <p className="text-muted-foreground">{(workerProfile as any)?.service_categories?.name || 'Worker'}</p>
        </div>
        <button onClick={toggleAvailability} disabled={toggling || !workerProfile}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors"
          style={{ background: available ? 'hsl(var(--success) / 0.15)' : 'hsl(var(--muted))' }}>
          {available ? <ToggleRight className="w-5 h-5 text-success" /> : <ToggleLeft className="w-5 h-5 text-muted-foreground" />}
          {available ? 'Available' : 'Unavailable'}
        </button>
      </div>

      {activeJob && (
        <div className="bg-card rounded-xl p-5 shadow-card border-2 border-success/30">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-dot" />
            <span className="text-sm font-semibold text-success">Active Assignment</span>
          </div>
          <h3 className="font-bold text-lg">{activeJob.category_name}</h3>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{activeJob.location}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{activeJob.shift_type} shift</span>
          </div>
          <div className="flex gap-3 mt-4">
            <Link to="/worker/attendance" className="flex-1">
              <Button className="w-full">Check In / Out</Button>
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Requests', icon: ClipboardList, path: '/worker/requests', count: `${requests.length} total` },
          { label: 'Attendance', icon: Clock, path: '/worker/attendance', count: 'Today' },
          { label: 'My Jobs', icon: Shield, path: '/worker/jobs', count: '' },
          { label: 'Profile', icon: User, path: '/worker/profile', count: '' },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link to={item.path}
              className="bg-card rounded-xl p-4 shadow-card border border-border hover:shadow-card-hover transition-all block">
              <item.icon className="w-6 h-6 text-primary mb-2" />
              <p className="font-semibold text-sm">{item.label}</p>
              {item.count && <p className="text-xs text-muted-foreground">{item.count}</p>}
            </Link>
          </motion.div>
        ))}
      </div>

      {workerProfile && (
        <div className="bg-card rounded-xl p-5 shadow-card border border-border">
          <h3 className="font-semibold mb-3">Your Profile</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Rating</span><span className="flex items-center gap-1 font-medium"><Star className="w-3 h-3 text-accent" />{workerProfile.rating}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Experience</span><span className="font-medium">{workerProfile.experience} years</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Salary Expectation</span><span className="font-medium">₹{workerProfile.expected_salary.toLocaleString()}/mo</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span className="font-medium">{workerProfile.location}</span></div>
            {workerProfile.skills && workerProfile.skills.length > 0 && (
              <div>
                <span className="text-muted-foreground">Skills</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {workerProfile.skills.map(s => <span key={s} className="px-2 py-0.5 bg-secondary rounded-full text-xs">{s}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerHome;
