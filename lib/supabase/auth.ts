import { createServerSupabaseClient } from './server';
import { createBrowserSupabaseClient } from './client-component';

// Server-side auth functions
export async function getSession() {
  const supabase = await createServerSupabaseClient();
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function getUserProfile() {
  const supabase = await createServerSupabaseClient();
  const session = await getSession();
  
  if (!session?.user) {
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .eq('id', session.user.id)
      .single();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

// Client-side auth functions (to be used in 'use client' components)
export const signUp = async (email: string, password: string) => {
  const supabase = createBrowserSupabaseClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const supabase = createBrowserSupabaseClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

export const signOut = async () => {
  const supabase = createBrowserSupabaseClient();
  
  const { error } = await supabase.auth.signOut();
  
  return { error };
};
