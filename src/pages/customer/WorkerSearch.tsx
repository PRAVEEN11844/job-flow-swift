import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { mockWorkers, serviceCategories } from '@/data/mockData';
import { AvailabilityBadge } from '@/components/StatusBadge';
import { Search, Filter, Star, MapPin, Clock, IndianRupee, ChevronDown, X, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

const WorkerSearch = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [shift, setShift] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return mockWorkers.filter(w => {
      if (category !== 'all' && w.category !== category) return false;
      if (shift !== 'all' && w.preferredShift !== shift) return false;
      if (search && !w.name.toLowerCase().includes(search.toLowerCase()) && !w.category.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [category, shift, search]);

  const selected = selectedWorker ? mockWorkers.find(w => w.id === selectedWorker) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Search Workers</h1>
        <p className="text-muted-foreground">Find the right worker for your needs</p>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name or category..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="w-4 h-4 mr-2" /> Filters {showFilters ? <ChevronDown className="w-3 h-3 ml-1 rotate-180" /> : <ChevronDown className="w-3 h-3 ml-1" />}
        </Button>
      </div>

      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-card rounded-xl p-4 shadow-card border border-border grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {serviceCategories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Shift Type</label>
            <Select value={shift} onValueChange={setShift}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shifts</SelectItem>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="night">Night</SelectItem>
                <SelectItem value="24hr">24 Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button variant="ghost" size="sm" onClick={() => { setCategory('all'); setShift('all'); setSearch(''); }}>
              <X className="w-3 h-3 mr-1" /> Clear
            </Button>
          </div>
        </motion.div>
      )}

      <p className="text-sm text-muted-foreground">{filtered.length} workers found</p>

      {/* Worker List */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((w, i) => (
          <motion.div key={w.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl p-4 shadow-card border border-border hover:shadow-card-hover transition-all cursor-pointer"
            onClick={() => setSelectedWorker(w.id)}>
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{w.name}</p>
                    <p className="text-sm text-muted-foreground">{w.category}</p>
                  </div>
                  <AvailabilityBadge status={w.availability} />
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{w.experience} yrs</span>
                  <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />₹{w.expectedSalary.toLocaleString()}/mo</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{w.location}</span>
                  {w.verified && <span className="flex items-center gap-1 text-success"><Star className="w-3 h-3" />Verified</span>}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Worker Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30" onClick={() => setSelectedWorker(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl p-6 max-w-md w-full shadow-xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{selected.name}</h3>
                <p className="text-muted-foreground">{selected.category}</p>
                <AvailabilityBadge status={selected.availability} />
              </div>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Experience</span><span className="font-medium">{selected.experience} years</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Expected Salary</span><span className="font-medium">₹{selected.expectedSalary.toLocaleString()}/mo</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Preferred Shift</span><span className="font-medium capitalize">{selected.preferredShift}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Location</span><span className="font-medium">{selected.location}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Rating</span><span className="font-medium flex items-center gap-1"><Star className="w-3 h-3 text-accent" />{selected.rating}</span></div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.skills.map(s => <span key={s} className="px-2 py-0.5 bg-secondary rounded-full text-xs font-medium">{s}</span>)}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Documents</p>
                <div className="space-y-1">
                  {selected.documents.map(d => (
                    <div key={d.type} className="flex justify-between text-xs">
                      <span>{d.type}</span>
                      <span className={d.status === 'verified' ? 'text-success' : d.status === 'rejected' ? 'text-destructive' : 'text-warning'}>{d.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to={`/customer/request?category=${encodeURIComponent(selected.category)}&worker=${selected.id}`} className="flex-1">
                <Button className="w-full">Request This Worker</Button>
              </Link>
              <Button variant="outline" onClick={() => setSelectedWorker(null)}>Close</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default WorkerSearch;
