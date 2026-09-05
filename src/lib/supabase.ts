import { createClient } from '@supabase/supabase-js';

// The project URL is extracted from the JWT "ref" claim provided earlier (bgykguysnjxxfmbhtyal)
const supabaseUrl = 'https://bgykguysnjxxfmbhtyal.supabase.co';
// The anon public key provided in the instructions
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJneWtndXlzbmp4eGZtYmh0eWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4Mjc3OTAsImV4cCI6MjEwMzQwMzc5MH0.14_DAR3xIErHAk-QBaGzL4vFoG5_GH3IDFUVoJCMpCA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
