import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useServiceCategories, useMyRequests } from '@/hooks/useSupabaseData';
import { StatusBadge } from '@/components/StatusBadge';
import { Shield, Search, Eye, Sparkles, Car, Wrench, HardHat, Briefcase, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Shield, Eye, Sparkles, Car, Wrench, HardHat, Briefcase, Coffee,
};

const CustomerHome = () => {
  const { user } = useAuth();
  const { data: categories = [] } = useServiceCategories();
  const { data: requests = [] } = useMyRequests();
  const recentRequests = requests.slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user?.name || 'Customer'}</h1>
        <p className="text-muted-foreground">Find and request verified workers for your business</p>
      </div>

      <Link to="/customer/search" className="flex items-center gap-3 bg-card rounded-xl p-4 shadow-card border border-border hover:border-primary/30 transition-colors">
        <Search className="w-5 h-5 text-muted-foreground" />
        <span className="text-muted-foreground">Search workers by category, location...</span>
      </Link>

      <div>
        <h2 className="text-lg font-semibold mb-4">Service Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || Shield;
            return (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/customer/search?category=${encodeURIComponent(cat.name)}`}
                  className="bg-card rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all block group border border-transparent hover:border-primary/20">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-medium text-sm">{cat.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {recentRequests.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Requests</h2>
            <Link to="/customer/requests" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentRequests.map(r => (
              <div key={r.id} className="bg-card rounded-xl p-4 shadow-card border border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{r.category_name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.location}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerHome;
