
-- Fix overly permissive notifications INSERT policy
DROP POLICY "System can insert notifications" ON public.notifications;

-- Only authenticated users can insert notifications (typically done via triggers/functions)
CREATE POLICY "Authenticated users can insert notifications" ON public.notifications
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
