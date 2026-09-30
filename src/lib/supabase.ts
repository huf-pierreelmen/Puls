import { createClient } from '@supabase/supabase-js';
import { readSupabaseConfig } from './supabase-config';

export const supabaseConfig = readSupabaseConfig(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

// Missing configuration must not prevent local UI development.
export const supabase = supabaseConfig.status === 'ready'
  ? createClient(supabaseConfig.url, supabaseConfig.key)
  : null;
