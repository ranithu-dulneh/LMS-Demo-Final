-- Add max_devices to student profiles
ALTER TABLE public.student_profiles ADD COLUMN IF NOT EXISTS max_devices integer default 1 not null;

-- Create device sessions table to track registered devices and activity
CREATE TABLE public.device_sessions (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.student_profiles(id) on delete cascade not null,
    device_token text not null,
    last_active_at timestamp with time zone default timezone('utc'::text, now()) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, device_token)
);

-- Enable RLS for device sessions
ALTER TABLE public.device_sessions ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own device sessions
CREATE POLICY "Users can manage their own device sessions" ON public.device_sessions FOR ALL USING (auth.uid() = user_id);

-- Admins can view and delete all device sessions (if they need to reset)
CREATE POLICY "Admins can view and edit all device sessions" ON public.device_sessions FOR ALL USING (public.is_admin());
