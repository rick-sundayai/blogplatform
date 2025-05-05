import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// These environment variables are set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a more robust singleton pattern for the Supabase client
// that works properly in both server and client environments
let supabaseInstance: ReturnType<typeof createClient<Database>>;

// This approach prevents multiple instances in browser environments
export const getSupabase = () => {
  if (typeof window === 'undefined') {
    // Server-side: Always create a new instance (won't be shared between requests)
    return createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  
  // Client-side: Create the instance once and reuse it
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  
  return supabaseInstance;
};

// For backward compatibility and simpler imports
export const supabase = getSupabase();
