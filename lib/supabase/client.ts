import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// These environment variables are set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if the environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
}

// Create a singleton Supabase client
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;
  
  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};

// For backward compatibility and simpler imports
export const supabase = getSupabase();
