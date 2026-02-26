import { useState } from 'react';
import { useWorkerProfiles } from '@/hooks/useSupabaseData';
import { AvailabilityBadge } from '@/components/StatusBadge';
import { Search, Plus, User, CheckCircle, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const WorkersManagement = () => {
  const [search, setSearch] = useState('');
  const { data: workers = [], isLoading } = useWorkerProfiles();

  const filtered = workers.filter(w => {
    const name = (w as any).profiles?.name || '';
    const catName = (w as any).service_categories?.name || '';
    return name.toLowerCase().includes(search.toLowerCase()) || catName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workers Management</h1>
          <p className="text-muted-foreground">{workers.length} total workers</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> Add Worker</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search workers..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">Loading...</div>
      ) : (
        <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">Worker</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Category</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Experience</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Salary</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Verified</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((w, i) => (
                  <motion.tr key={w.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{(w as any).profiles?.name || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">{(w as any).profiles?.phone || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{(w as any).service_categories?.name || '—'}</td>
                    <td className="p-4">{w.experience} yrs</td>
                    <td className="p-4">₹{w.expected_salary.toLocaleString()}</td>
                    <td className="p-4"><AvailabilityBadge status={w.availability as any} /></td>
                    <td className="p-4">
                      {w.verified
                        ? <CheckCircle className="w-4 h-4 text-success" />
                        : <Clock className="w-4 h-4 text-warning" />}
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No workers found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkersManagement;
