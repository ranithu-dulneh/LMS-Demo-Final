-- Create a sequence for student IDs
CREATE SEQUENCE IF NOT EXISTS public.student_id_seq START 1;

-- Function and Trigger to create profile automatically and generate Student ID safely
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

    INSERT INTO public.student_profiles (id, full_name, student_id, is_approved)
    VALUES (new.id, new.raw_user_meta_data->>'full_name', new_student_id, false);

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
