-- Create reference tables for admin-managed settings
CREATE TABLE public.institutions (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    location text,
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE public.intake_batches (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE public.mediums (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS and create public read policies for the frontend dropdowns
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intake_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mediums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to institutions" ON public.institutions FOR SELECT USING (true);
CREATE POLICY "Allow admin write access to institutions" ON public.institutions FOR ALL USING (
    auth.role() = 'authenticated' AND
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

CREATE POLICY "Allow public read access to intake_batches" ON public.intake_batches FOR SELECT USING (true);
CREATE POLICY "Allow admin write access to intake_batches" ON public.intake_batches FOR ALL USING (
    auth.role() = 'authenticated' AND
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

CREATE POLICY "Allow public read access to mediums" ON public.mediums FOR SELECT USING (true);
CREATE POLICY "Allow admin write access to mediums" ON public.mediums FOR ALL USING (
    auth.role() = 'authenticated' AND
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- Alter student_profiles to include new enrollment data
ALTER TABLE public.student_profiles
ADD COLUMN IF NOT EXISTS institution_id uuid references public.institutions(id),
ADD COLUMN IF NOT EXISTS batch_id uuid references public.intake_batches(id),
ADD COLUMN IF NOT EXISTS medium_id uuid references public.mediums(id),
ADD COLUMN IF NOT EXISTS course_program text,
ADD COLUMN IF NOT EXISTS mobile_number text,
ADD COLUMN IF NOT EXISTS district text;

-- Create sequence if it does not exist
CREATE SEQUENCE IF NOT EXISTS public.student_id_seq START WITH 1;

-- Replace the handle_new_user function to map user_meta_data into student_profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    new_student_id text;
    year_prefix text;
    seq_val bigint;
BEGIN
    year_prefix := to_char(now(), 'YYYY');

    -- Use the sequence for robust ID generation
    seq_val := nextval('public.student_id_seq');

    new_student_id := year_prefix || '-' || lpad(seq_val::text, 4, '0');

    INSERT INTO public.student_profiles (
        id,
        full_name,
        student_id,
        is_approved,
        institution_id,
        batch_id,
        medium_id,
        course_program,
        mobile_number,
        district
    )
    VALUES (
        new.id,
        new.raw_user_meta_data->>'full_name',
        new_student_id,
        false,
        NULLIF(new.raw_user_meta_data->>'institution_id', '')::uuid,
        NULLIF(new.raw_user_meta_data->>'batch_id', '')::uuid,
        NULLIF(new.raw_user_meta_data->>'medium_id', '')::uuid,
        new.raw_user_meta_data->>'course_program',
        new.raw_user_meta_data->>'mobile_number',
        new.raw_user_meta_data->>'district'
    );

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some default values to avoid empty dropdowns initially
INSERT INTO public.institutions (name, location) VALUES
('Inspire Online', 'Islandwide Online'),
('Ziyon Academy', 'Kurunegala - Ziyon');

INSERT INTO public.intake_batches (name) VALUES
('A/L 2026 Intake'),
('A/L 2027 Intake');

INSERT INTO public.mediums (name) VALUES
('Sinhala'),
('English'),
('Tamil');
