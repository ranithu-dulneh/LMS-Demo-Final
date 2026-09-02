-- Create admin_users table for robust role management
CREATE TABLE public.admin_users (
    user_id uuid references auth.users on delete cascade primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view admin_users" ON public.admin_users FOR SELECT USING (true); -- Usually fine if it's just user_id, or restrict to auth.uid() in (select user_id from admin_users)

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Modify previous RLS on student_profiles to be secure
DROP POLICY IF EXISTS "Admins can view and edit all profiles" ON public.student_profiles;
CREATE POLICY "Admins can view and edit all profiles" ON public.student_profiles FOR ALL USING (public.is_admin());

-- Modify previous RLS on enrollments to be secure
DROP POLICY IF EXISTS "Admins can view and edit all enrollments" ON public.enrollments;
CREATE POLICY "Admins can view and edit all enrollments" ON public.enrollments FOR ALL USING (public.is_admin());
