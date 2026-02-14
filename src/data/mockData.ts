import { ServiceCategory, Worker, ServiceRequest, AttendanceRecord, AppNotification } from '@/types';

export const serviceCategories: ServiceCategory[] = [
  { id: '1', name: 'Security Guard', icon: 'Shield', description: 'Trained security personnel for premises protection', workerCount: 124 },
  { id: '2', name: 'Watchman', icon: 'Eye', description: 'Round-the-clock surveillance and monitoring', workerCount: 89 },
  { id: '3', name: 'Housekeeping', icon: 'Sparkles', description: 'Professional cleaning and maintenance staff', workerCount: 156 },
  { id: '4', name: 'Driver', icon: 'Car', description: 'Licensed drivers for all vehicle types', workerCount: 67 },
  { id: '5', name: 'Labour (Skilled)', icon: 'Wrench', description: 'Experienced skilled workers for specialized tasks', workerCount: 203 },
  { id: '6', name: 'Labour (Unskilled)', icon: 'HardHat', description: 'General labour for various tasks', workerCount: 312 },
  { id: '7', name: 'Office Staff', icon: 'Briefcase', description: 'Administrative and office support personnel', workerCount: 45 },
  { id: '8', name: 'Office Boy', icon: 'Coffee', description: 'Support staff for office operations', workerCount: 78 },
];

export const mockWorkers: Worker[] = [
  { id: 'w1', name: 'Rajesh Kumar', phone: '9876543210', category: 'Security Guard', skills: ['CCTV Monitoring', 'Fire Safety', 'First Aid'], experience: 5, expectedSalary: 18000, preferredShift: 'night', availability: 'available', location: 'Hyderabad', verified: true, rating: 4.5, documents: [{ type: 'Aadhar', status: 'verified' }, { type: 'PAN', status: 'verified' }] },
  { id: 'w2', name: 'Suresh Reddy', phone: '9876543211', category: 'Security Guard', skills: ['Access Control', 'Patrol', 'Emergency Response'], experience: 3, expectedSalary: 15000, preferredShift: 'day', availability: 'available', location: 'Hyderabad', verified: true, rating: 4.2, documents: [{ type: 'Aadhar', status: 'verified' }, { type: 'PAN', status: 'pending' }] },
  { id: 'w3', name: 'Priya Sharma', phone: '9876543212', category: 'Housekeeping', skills: ['Deep Cleaning', 'Floor Care', 'Sanitization'], experience: 4, expectedSalary: 14000, preferredShift: 'day', availability: 'available', location: 'Secunderabad', verified: true, rating: 4.8, documents: [{ type: 'Aadhar', status: 'verified' }, { type: 'Photo', status: 'verified' }] },
  { id: 'w4', name: 'Mohammed Ali', phone: '9876543213', category: 'Driver', skills: ['Heavy Vehicle', 'City Navigation', 'Vehicle Maintenance'], experience: 8, expectedSalary: 22000, preferredShift: '24hr', availability: 'busy', location: 'Hyderabad', verified: true, rating: 4.6, documents: [{ type: 'Aadhar', status: 'verified' }, { type: 'License', status: 'verified' }] },
  { id: 'w5', name: 'Venkat Rao', phone: '9876543214', category: 'Watchman', skills: ['Night Watch', 'Gate Management', 'Logbook'], experience: 6, expectedSalary: 13000, preferredShift: 'night', availability: 'available', location: 'Kukatpally', verified: false, rating: 3.9, documents: [{ type: 'Aadhar', status: 'pending' }, { type: 'PAN', status: 'rejected' }] },
  { id: 'w6', name: 'Lakshmi Devi', phone: '9876543215', category: 'Office Staff', skills: ['Data Entry', 'Filing', 'Reception'], experience: 2, expectedSalary: 16000, preferredShift: 'day', availability: 'available', location: 'Madhapur', verified: true, rating: 4.3, documents: [{ type: 'Aadhar', status: 'verified' }, { type: 'Certificate', status: 'verified' }] },
];

export const mockRequests: ServiceRequest[] = [
  { id: 'r1', customerId: 'c1', customerName: 'ABC Corp', category: 'Security Guard', startDate: '2026-02-20', shiftType: 'night', duration: '3 months', salaryOffer: 18000, location: 'Hitech City, Hyderabad', notes: 'Need experienced guard for IT park', status: 'active', assignedWorkerId: 'w1', assignedWorkerName: 'Rajesh Kumar', createdAt: '2026-02-10' },
  { id: 'r2', customerId: 'c1', customerName: 'ABC Corp', category: 'Housekeeping', startDate: '2026-02-25', shiftType: 'day', duration: '6 months', salaryOffer: 14000, location: 'Gachibowli, Hyderabad', notes: 'Office cleaning 5 days a week', status: 'worker_assigned', assignedWorkerId: 'w3', assignedWorkerName: 'Priya Sharma', createdAt: '2026-02-12' },
  { id: 'r3', customerId: 'c2', customerName: 'XYZ Industries', category: 'Driver', startDate: '2026-03-01', shiftType: '24hr', duration: '1 year', salaryOffer: 25000, location: 'Jubilee Hills, Hyderabad', notes: 'Personal driver for MD', status: 'pending', createdAt: '2026-02-13' },
  { id: 'r4', customerId: 'c2', customerName: 'XYZ Industries', category: 'Security Guard', startDate: '2026-02-18', shiftType: 'day', duration: '1 month', salaryOffer: 16000, location: 'Banjara Hills, Hyderabad', notes: 'Event security', status: 'completed', assignedWorkerId: 'w2', assignedWorkerName: 'Suresh Reddy', createdAt: '2026-02-01' },
  { id: 'r5', customerId: 'c1', customerName: 'ABC Corp', category: 'Watchman', startDate: '2026-03-05', shiftType: 'night', duration: '6 months', salaryOffer: 13000, location: 'Kukatpally, Hyderabad', notes: 'Residential society watchman', status: 'admin_reviewing', createdAt: '2026-02-14' },
];

export const mockAttendance: AttendanceRecord[] = [
  { id: 'a1', workerId: 'w1', workerName: 'Rajesh Kumar', requestId: 'r1', checkIn: '2026-02-14T20:00:00', checkOut: '2026-02-15T06:00:00', checkInLocation: { lat: 17.4435, lng: 78.3772 }, checkOutLocation: { lat: 17.4435, lng: 78.3772 }, date: '2026-02-14', status: 'checked-out' },
  { id: 'a2', workerId: 'w1', workerName: 'Rajesh Kumar', requestId: 'r1', checkIn: '2026-02-13T20:00:00', checkOut: '2026-02-14T06:00:00', checkInLocation: { lat: 17.4435, lng: 78.3772 }, checkOutLocation: { lat: 17.4435, lng: 78.3772 }, date: '2026-02-13', status: 'checked-out' },
  { id: 'a3', workerId: 'w3', workerName: 'Priya Sharma', requestId: 'r2', checkIn: '2026-02-14T09:00:00', checkInLocation: { lat: 17.4400, lng: 78.3489 }, date: '2026-02-14', status: 'checked-in' },
];

export const mockNotifications: AppNotification[] = [
  { id: 'n1', userId: 'c1', title: 'Worker Assigned', message: 'Rajesh Kumar has been assigned to your security request', type: 'assignment', read: false, createdAt: '2026-02-14T10:00:00' },
  { id: 'n2', userId: 'c1', title: 'Worker Checked In', message: 'Rajesh Kumar checked in at Hitech City', type: 'attendance', read: false, createdAt: '2026-02-14T20:05:00' },
  { id: 'n3', userId: 'w1', title: 'New Job Request', message: 'You have a new job request from ABC Corp', type: 'request', read: true, createdAt: '2026-02-13T14:00:00' },
  { id: 'n4', userId: 'admin', title: 'New Request', message: 'XYZ Industries submitted a new driver request', type: 'request', read: false, createdAt: '2026-02-13T16:00:00' },
];
