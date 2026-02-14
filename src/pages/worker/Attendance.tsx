import { useState } from 'react';
import { mockRequests, mockAttendance } from '@/data/mockData';
import { MapPin, Clock, LogIn, LogOut, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Attendance = () => {
  const activeJob = mockRequests.find(r => r.status === 'active' && r.assignedWorkerId === 'w1');
  const todayRecords = mockAttendance.filter(a => a.workerId === 'w1');
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  const handleCheckIn = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setCheckedIn(true);
          setCheckInTime(new Date().toLocaleTimeString());
          toast.success('Checked in successfully! Location recorded.');
        },
        () => toast.error('Please enable location services to check in.')
      );
    } else {
      setCheckedIn(true);
      setCheckInTime(new Date().toLocaleTimeString());
      toast.success('Checked in successfully!');
    }
  };

  const handleCheckOut = () => {
    setCheckedIn(false);
    setCheckInTime(null);
    toast.success('Checked out successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Attendance</h1>
        <p className="text-muted-foreground">Check in/out for your active assignment</p>
      </div>

      {/* Active Job Info */}
      {activeJob ? (
        <>
          <div className="bg-card rounded-xl p-5 shadow-card border border-border">
            <h3 className="font-semibold mb-1">{activeJob.category} — {activeJob.customerName}</h3>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{activeJob.location}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{activeJob.shiftType} shift</span>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="bg-card rounded-xl overflow-hidden shadow-card border border-border">
            <div className="h-48 bg-muted flex items-center justify-center relative">
              <div className="text-center">
                <Navigation className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Map view — enable Cloud for GPS tracking</p>
                <p className="text-xs text-muted-foreground mt-1">Job: {activeJob.location}</p>
              </div>
              {/* Mock location pins */}
              <div className="absolute top-12 left-1/3 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary-foreground" />
              </div>
              <div className="absolute bottom-16 right-1/3 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-accent-foreground" />
              </div>
            </div>
            <div className="px-4 py-3 flex justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary" /> Job Location</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent" /> Your Location</span>
            </div>
          </div>

          {/* Check In/Out */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border text-center">
            {checkedIn ? (
              <>
                <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
                  <LogIn className="w-7 h-7 text-success" />
                </div>
                <p className="font-semibold text-lg mb-1">You're checked in</p>
                <p className="text-sm text-muted-foreground mb-4">Since {checkInTime}</p>
                <Button variant="destructive" size="lg" className="w-full max-w-xs" onClick={handleCheckOut}>
                  <LogOut className="w-4 h-4 mr-2" /> Check Out
                </Button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <LogIn className="w-7 h-7 text-primary" />
                </div>
                <p className="font-semibold text-lg mb-1">Ready to check in?</p>
                <p className="text-sm text-muted-foreground mb-4">Your GPS location will be recorded</p>
                <Button size="lg" className="w-full max-w-xs" onClick={handleCheckIn}>
                  <LogIn className="w-4 h-4 mr-2" /> Check In
                </Button>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="bg-card rounded-xl p-10 shadow-card text-center">
          <p className="text-muted-foreground">No active assignment. Check-in will be available once you have an active job.</p>
        </div>
      )}

      {/* Recent Records */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Records</h2>
        <div className="space-y-2">
          {todayRecords.map(a => (
            <div key={a.id} className="bg-card rounded-lg p-4 shadow-card border border-border flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{a.date}</p>
                <p className="text-xs text-muted-foreground">
                  In: {a.checkIn ? new Date(a.checkIn).toLocaleTimeString() : '—'} · Out: {a.checkOut ? new Date(a.checkOut).toLocaleTimeString() : '—'}
                </p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${a.status === 'checked-out' ? 'bg-success/15 text-success' : a.status === 'checked-in' ? 'bg-info/15 text-info' : 'bg-destructive/15 text-destructive'}`}>
                {a.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
