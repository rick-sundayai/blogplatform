import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// These environment variables are set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Define the client options with a consistent storage key
const clientOptions = {
  auth: {
    storageKey: 'blog-platform-auth',
    persistSession: true,
    autoRefreshToken: true
  }
};

// For client-side usage (true singleton pattern)
let browserInstance: ReturnType<typeof createClient<Database>> | null = null;

/**
 * Returns a Supabase client for use in the browser.
 * Ensures only one instance is created in the browser context.
 */
export const getSupabase = () => {
  if (typeof window === 'undefined') {
    // Server-side: Always create a fresh instance for each request
    return createClient<Database>(supabaseUrl, supabaseAnonKey, clientOptions);
  }

  // Client-side: Use singleton pattern to ensure only one instance exists
  if (!browserInstance) {
    browserInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, clientOptions);
  }

  return browserInstance;
};

/**
 * Creates a new Supabase client specifically for server components.
 * This should be used in server components that need to access Supabase.
 */
export const createServerSupabaseClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, clientOptions);
};