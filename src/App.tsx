import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import CustomerHome from "./pages/customer/CustomerHome";
import WorkerSearch from "./pages/customer/WorkerSearch";
import RequestForm from "./pages/customer/RequestForm";
import MyRequests from "./pages/customer/MyRequests";
import WorkerHome from "./pages/worker/WorkerHome";
import RequestsInbox from "./pages/worker/RequestsInbox";
import Attendance from "./pages/worker/Attendance";
import AdminDashboard from "./pages/admin/AdminDashboard";
import WorkersManagement from "./pages/admin/WorkersManagement";
import RequestsManagement from "./pages/admin/RequestsManagement";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode; allowedRole?: string }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRole && user?.role !== allowedRole) return <Navigate to={`/${user?.role}`} />;
  return <AppLayout>{children}</AppLayout>;
};

const AppRoutes = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to={user?.role === 'admin' ? '/admin' : `/${user?.role}`} /> : <Index />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to={user?.role === 'admin' ? '/admin' : `/${user?.role}`} /> : <Login />} />

      {/* Customer */}
      <Route path="/customer" element={<ProtectedRoute allowedRole="customer"><CustomerHome /></ProtectedRoute>} />
      <Route path="/customer/search" element={<ProtectedRoute allowedRole="customer"><WorkerSearch /></ProtectedRoute>} />
      <Route path="/customer/request" element={<ProtectedRoute allowedRole="customer"><RequestForm /></ProtectedRoute>} />
      <Route path="/customer/requests" element={<ProtectedRoute allowedRole="customer"><MyRequests /></ProtectedRoute>} />
      <Route path="/customer/notifications" element={<ProtectedRoute allowedRole="customer"><div className="animate-fade-in"><h1 className="text-2xl font-bold mb-4">Notifications</h1><p className="text-muted-foreground">No new notifications</p></div></ProtectedRoute>} />
      <Route path="/customer/profile" element={<ProtectedRoute allowedRole="customer"><div className="animate-fade-in"><h1 className="text-2xl font-bold mb-4">Profile</h1><p className="text-muted-foreground">Profile management coming soon</p></div></ProtectedRoute>} />
      <Route path="/customer/support" element={<ProtectedRoute allowedRole="customer"><div className="animate-fade-in"><h1 className="text-2xl font-bold mb-4">Support</h1><div className="space-y-3"><a href="https://wa.me/919876543210?text=Hi%2C%20I%20need%20help" target="_blank" rel="noopener noreferrer" className="bg-success/10 text-success p-4 rounded-xl block font-medium hover:bg-success/15">💬 Chat on WhatsApp</a><a href="tel:+919876543210" className="bg-primary/10 text-primary p-4 rounded-xl block font-medium hover:bg-primary/15">📞 Call Support: +91 98765 43210</a></div></div></ProtectedRoute>} />

      {/* Worker */}
      <Route path="/worker" element={<ProtectedRoute allowedRole="worker"><WorkerHome /></ProtectedRoute>} />
      <Route path="/worker/requests" element={<ProtectedRoute allowedRole="worker"><RequestsInbox /></ProtectedRoute>} />
      <Route path="/worker/attendance" element={<ProtectedRoute allowedRole="worker"><Attendance /></ProtectedRoute>} />
      <Route path="/worker/jobs" element={<ProtectedRoute allowedRole="worker"><div className="animate-fade-in"><h1 className="text-2xl font-bold mb-4">Job History</h1><p className="text-muted-foreground">Your completed jobs will appear here</p></div></ProtectedRoute>} />
      <Route path="/worker/profile" element={<ProtectedRoute allowedRole="worker"><div className="animate-fade-in"><h1 className="text-2xl font-bold mb-4">Worker Profile</h1><p className="text-muted-foreground">Profile & document upload coming soon</p></div></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/workers" element={<ProtectedRoute allowedRole="admin"><WorkersManagement /></ProtectedRoute>} />
      <Route path="/admin/customers" element={<ProtectedRoute allowedRole="admin"><div className="animate-fade-in"><h1 className="text-2xl font-bold mb-4">Customers</h1><p className="text-muted-foreground">Customer management coming soon</p></div></ProtectedRoute>} />
      <Route path="/admin/requests" element={<ProtectedRoute allowedRole="admin"><RequestsManagement /></ProtectedRoute>} />
      <Route path="/admin/attendance" element={<ProtectedRoute allowedRole="admin"><div className="animate-fade-in"><h1 className="text-2xl font-bold mb-4">Attendance Management</h1><p className="text-muted-foreground">View attendance records here</p></div></ProtectedRoute>} />
      <Route path="/admin/tracking" element={<ProtectedRoute allowedRole="admin"><div className="animate-fade-in"><h1 className="text-2xl font-bold mb-4">Live Tracking</h1><p className="text-muted-foreground">Live worker tracking map coming soon</p></div></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute allowedRole="admin"><div className="animate-fade-in"><h1 className="text-2xl font-bold mb-4">Reports</h1><p className="text-muted-foreground">Reports & exports coming soon</p></div></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allowedRole="admin"><div className="animate-fade-in"><h1 className="text-2xl font-bold mb-4">Settings</h1><p className="text-muted-foreground">Platform settings coming soon</p></div></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
