import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { serviceCategories } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Calendar, Clock, IndianRupee, Send } from 'lucide-react';
import { toast } from 'sonner';

const RequestForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    category: searchParams.get('category') || '',
    startDate: '',
    shiftType: 'day',
    duration: '',
    salaryOffer: '',
    location: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.startDate || !form.location || !form.duration) {
      toast.error('Please fill all required fields');
      return;
    }
    toast.success('Request submitted successfully! Our team will review it shortly.');
    navigate('/customer/requests');
  };

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold mb-1">New Worker Request</h1>
      <p className="text-muted-foreground mb-6">Fill in the details to request a worker</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Service Category *</label>
          <Select value={form.category} onValueChange={v => update('category', v)}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {serviceCategories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Start Date *</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="date" className="pl-10" value={form.startDate} onChange={e => update('startDate', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Shift Type *</label>
            <Select value={form.shiftType} onValueChange={v => update('shiftType', v)}>
              <SelectTrigger><Clock className="w-4 h-4 mr-2 text-muted-foreground" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day Shift</SelectItem>
                <SelectItem value="night">Night Shift</SelectItem>
                <SelectItem value="24hr">24 Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Duration *</label>
            <Input placeholder="e.g. 3 months" value={form.duration} onChange={e => update('duration', e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Salary Offer (₹/month)</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="number" className="pl-10" placeholder="15000" value={form.salaryOffer} onChange={e => update('salaryOffer', e.target.value)} />
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Work Location *</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input className="pl-10" placeholder="Enter address or area" value={form.location} onChange={e => update('location', e.target.value)} />
          </div>
          <div className="mt-2 h-32 rounded-lg bg-muted flex items-center justify-center text-sm text-muted-foreground border border-border">
            <MapPin className="w-4 h-4 mr-2" /> Map view — enable Cloud for live maps
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Additional Notes</label>
          <Textarea placeholder="Any special requirements..." value={form.notes} onChange={e => update('notes', e.target.value)} rows={3} />
        </div>

        <Button type="submit" className="w-full" size="lg">
          <Send className="w-4 h-4 mr-2" /> Submit Request
        </Button>
      </form>
    </div>
  );
};

export default RequestForm;
