import { createClient } from '@supabase/supabase-js';

// The project URL is extracted from the JWT "ref" claim provided earlier (bgykguysnjxxfmbhtyal)
const supabaseUrl = 'https://bgykguysnjxxfmbhtyal.supabase.co';
// The anon public key provided in the instructions
const supabaseAnonKey = 'sb_publishable__P3ZaUE-15hMbIVHJNTRxw_vtKy15eS';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
