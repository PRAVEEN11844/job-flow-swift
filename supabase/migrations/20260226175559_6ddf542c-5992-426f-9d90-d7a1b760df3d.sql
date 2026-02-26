
-- ============================================
-- HANVIKA MANPOWER SUPPLY - DATABASE SCHEMA
-- ============================================

-- 1. Role enum
CREATE TYPE public.app_role AS ENUM ('customer', 'worker', 'admin');

-- 2. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. User roles table (security-critical, separate from profiles)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 5. Service categories table
CREATE TABLE public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL DEFAULT 'Wrench',
  description TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

-- 6. Worker profiles (extended info)
CREATE TABLE public.worker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  category_id UUID REFERENCES public.service_categories(id),
  skills TEXT[] DEFAULT '{}',
  experience INTEGER NOT NULL DEFAULT 0,
  expected_salary INTEGER NOT NULL DEFAULT 0,
  preferred_shift TEXT NOT NULL DEFAULT 'day' CHECK (preferred_shift IN ('day', 'night', '24hr')),
  availability TEXT NOT NULL DEFAULT 'available' CHECK (availability IN ('available', 'busy', 'unavailable')),
  location TEXT NOT NULL DEFAULT '',
  verified BOOLEAN NOT NULL DEFAULT false,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;

-- 7. Worker documents
CREATE TABLE public.worker_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.worker_documents ENABLE ROW LEVEL SECURITY;

-- 8. Service requests
CREATE TABLE public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  category_id UUID REFERENCES public.service_categories(id),
  category_name TEXT NOT NULL DEFAULT '',
  start_date DATE,
  shift_type TEXT NOT NULL DEFAULT 'day' CHECK (shift_type IN ('day', 'night', '24hr')),
  duration TEXT NOT NULL DEFAULT '',
  salary_offer INTEGER NOT NULL DEFAULT 0,
  location TEXT NOT NULL DEFAULT '',
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'admin_reviewing', 'worker_assigned', 'worker_accepted', 'active', 'completed', 'cancelled')),
  assigned_worker_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- 9. Attendance records
CREATE TABLE public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL,
  request_id UUID REFERENCES public.service_requests(id),
  check_in TIMESTAMPTZ,
  check_out TIMESTAMPTZ,
  check_in_lat DOUBLE PRECISION,
  check_in_lng DOUBLE PRECISION,
  check_out_lat DOUBLE PRECISION,
  check_out_lng DOUBLE PRECISION,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'checked-in' CHECK (status IN ('checked-in', 'checked-out', 'missed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- 10. Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('request', 'assignment', 'attendance', 'general')),
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Profiles: users read own, admins read all
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles: users read own, admins manage all
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Service categories: public read, admin manage
CREATE POLICY "Anyone can read categories" ON public.service_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.service_categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Worker profiles: public read (for search), worker updates own, admin manages
CREATE POLICY "Anyone can read worker profiles" ON public.worker_profiles FOR SELECT USING (true);
CREATE POLICY "Workers can update own profile" ON public.worker_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Workers can insert own profile" ON public.worker_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage worker profiles" ON public.worker_profiles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Worker documents: worker reads own, admin reads all
CREATE POLICY "Workers can read own documents" ON public.worker_documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.worker_profiles wp WHERE wp.id = worker_id AND wp.user_id = auth.uid())
);
CREATE POLICY "Workers can insert own documents" ON public.worker_documents FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.worker_profiles wp WHERE wp.id = worker_id AND wp.user_id = auth.uid())
);
CREATE POLICY "Admins can manage documents" ON public.worker_documents FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Service requests: customer reads own, worker reads assigned, admin reads all
CREATE POLICY "Customers can read own requests" ON public.service_requests FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Workers can read assigned requests" ON public.service_requests FOR SELECT USING (auth.uid() = assigned_worker_id);
CREATE POLICY "Admins can read all requests" ON public.service_requests FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Customers can create requests" ON public.service_requests FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Admins can update requests" ON public.service_requests FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Workers can update assigned requests" ON public.service_requests FOR UPDATE USING (auth.uid() = assigned_worker_id);

-- Attendance: worker reads own, admin reads all
CREATE POLICY "Workers can read own attendance" ON public.attendance_records FOR SELECT USING (auth.uid() = worker_id);
CREATE POLICY "Workers can insert own attendance" ON public.attendance_records FOR INSERT WITH CHECK (auth.uid() = worker_id);
CREATE POLICY "Workers can update own attendance" ON public.attendance_records FOR UPDATE USING (auth.uid() = worker_id);
CREATE POLICY "Admins can read all attendance" ON public.attendance_records FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Notifications: users read own
CREATE POLICY "Users can read own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- ============================================
-- TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_worker_profiles_updated_at BEFORE UPDATE ON public.worker_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON public.service_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone, '')
  );
  -- Auto-assign role from metadata
  IF NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, (NEW.raw_user_meta_data->>'role')::app_role);
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'customer');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ENABLE REALTIME
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.service_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance_records;

-- ============================================
-- SEED SERVICE CATEGORIES
-- ============================================

INSERT INTO public.service_categories (name, icon, description) VALUES
  ('Security Guard', 'Shield', 'Professional security guards for residential & commercial'),
  ('Watchman', 'Eye', 'Night and day watchmen for premises'),
  ('Housekeeping', 'Sparkles', 'Cleaning and maintenance staff'),
  ('Driver', 'Car', 'Professional drivers for personal and commercial vehicles'),
  ('Skilled Labour', 'Wrench', 'Electricians, plumbers, carpenters and more'),
  ('Unskilled Labour', 'HardHat', 'General helpers and manual labour'),
  ('Office Staff', 'Briefcase', 'Receptionist, office boy, peon and admin staff');
