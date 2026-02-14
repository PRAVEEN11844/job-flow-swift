export type UserRole = 'customer' | 'worker' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  workerCount: number;
}

export interface Worker {
  id: string;
  name: string;
  phone: string;
  photo?: string;
  category: string;
  skills: string[];
  experience: number;
  expectedSalary: number;
  preferredShift: 'day' | 'night' | '24hr';
  availability: 'available' | 'busy' | 'unavailable';
  location: string;
  verified: boolean;
  rating: number;
  documents: { type: string; status: 'pending' | 'verified' | 'rejected' }[];
}

export type RequestStatus = 'pending' | 'admin_reviewing' | 'worker_assigned' | 'worker_accepted' | 'active' | 'completed' | 'cancelled';

export interface ServiceRequest {
  id: string;
  customerId: string;
  customerName: string;
  category: string;
  startDate: string;
  shiftType: 'day' | 'night' | '24hr';
  duration: string;
  salaryOffer: number;
  location: string;
  locationCoords?: { lat: number; lng: number };
  notes: string;
  status: RequestStatus;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  workerId: string;
  workerName: string;
  requestId: string;
  checkIn?: string;
  checkOut?: string;
  checkInLocation?: { lat: number; lng: number };
  checkOutLocation?: { lat: number; lng: number };
  date: string;
  status: 'checked-in' | 'checked-out' | 'missed';
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'request' | 'assignment' | 'attendance' | 'general';
  read: boolean;
  createdAt: string;
}
