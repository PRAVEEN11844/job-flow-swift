import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useServiceCategories() {
  return useQuery({
    queryKey: ['service_categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data;
    },
  });
}

export function useWorkerProfiles(filters?: { category_id?: string; availability?: string }) {
  return useQuery({
    queryKey: ['worker_profiles', filters],
    queryFn: async () => {
      let query = supabase
        .from('worker_profiles')
        .select('*, service_categories(name, icon), profiles(name, phone, avatar_url)');
      if (filters?.category_id) query = query.eq('category_id', filters.category_id);
      if (filters?.availability) query = query.eq('availability', filters.availability);
      const { data, error } = await query.order('rating', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useMyRequests() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['my_requests', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useAllRequests() {
  return useQuery({
    queryKey: ['all_requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useWorkerRequests() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['worker_requests', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('assigned_worker_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (req: {
      category_name: string;
      category_id?: string;
      start_date?: string;
      shift_type: string;
      duration: string;
      salary_offer: number;
      location: string;
      notes?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('service_requests').insert({
        customer_id: user.id,
        ...req,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my_requests'] });
      queryClient.invalidateQueries({ queryKey: ['all_requests'] });
    },
  });
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, assigned_worker_id }: { id: string; status: string; assigned_worker_id?: string }) => {
      const update: any = { status };
      if (assigned_worker_id) update.assigned_worker_id = assigned_worker_id;
      const { error } = await supabase.from('service_requests').update(update).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all_requests'] });
      queryClient.invalidateQueries({ queryKey: ['my_requests'] });
      queryClient.invalidateQueries({ queryKey: ['worker_requests'] });
    },
  });
}

export function useMyAttendance() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['my_attendance', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('worker_id', user.id)
        .order('date', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ request_id, lat, lng }: { request_id: string; lat: number; lng: number }) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('attendance_records').insert({
        worker_id: user.id,
        request_id,
        check_in: new Date().toISOString(),
        check_in_lat: lat,
        check_in_lng: lng,
        status: 'checked-in',
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my_attendance'] }),
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, lat, lng }: { id: string; lat: number; lng: number }) => {
      const { error } = await supabase.from('attendance_records').update({
        check_out: new Date().toISOString(),
        check_out_lat: lat,
        check_out_lng: lng,
        status: 'checked-out',
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my_attendance'] }),
  });
}

export function useAllAttendance() {
  return useQuery({
    queryKey: ['all_attendance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .order('date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useNotifications() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useWorkerProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['worker_profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('worker_profiles')
        .select('*, service_categories(name, icon)')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin_stats'],
    queryFn: async () => {
      const [workers, requests, attendance] = await Promise.all([
        supabase.from('worker_profiles').select('availability', { count: 'exact' }),
        supabase.from('service_requests').select('status', { count: 'exact' }),
        supabase.from('attendance_records').select('status', { count: 'exact' }).eq('date', new Date().toISOString().split('T')[0]),
      ]);
      return {
        totalWorkers: workers.count || 0,
        totalRequests: requests.count || 0,
        todayAttendance: attendance.count || 0,
        workers: workers.data || [],
        requests: requests.data || [],
      };
    },
  });
}

export function useAllProfiles() {
  return useQuery({
    queryKey: ['all_profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}
