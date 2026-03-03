import { cn } from '@/lib/utils';
import { RequestStatus } from '@/types';

const statusConfig: Record<RequestStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-warning/15 text-warning-foreground border-warning/30' },
  admin_reviewing: { label: 'Reviewing', className: 'bg-info/15 text-info border-info/30' },
  worker_assigned: { label: 'Assigned', className: 'bg-primary/15 text-primary border-primary/30' },
  worker_accepted: { label: 'Accepted', className: 'bg-success/15 text-success border-success/30' },
  active: { label: 'Active', className: 'bg-success/15 text-success border-success/30' },
  completed: { label: 'Completed', className: 'bg-muted text-muted-foreground border-border' },
  cancelled: { label: 'Cancelled', className: 'bg-destructive/15 text-destructive border-destructive/30' },
};

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', config.className, className)}>
      {status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-success mr-1.5 animate-pulse-dot" />}
      {config.label}
    </span>
  );
};

export const AvailabilityBadge = ({ status }: { status: 'available' | 'busy' | 'unavailable' }) => {
  const config = {
    available: { label: 'Available', className: 'bg-success/15 text-success border-success/30' },
    busy: { label: 'Busy', className: 'bg-warning/15 text-warning-foreground border-warning/30' },
    unavailable: { label: 'Unavailable', className: 'bg-muted text-muted-foreground border-border' },
  };
  const c = config[status];
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', c.className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', status === 'available' ? 'bg-success animate-pulse-dot' : status === 'busy' ? 'bg-warning' : 'bg-muted-foreground')} />
      {c.label}
    </span>
  );
};
