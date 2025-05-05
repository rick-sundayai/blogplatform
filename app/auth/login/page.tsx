import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AuthForm from '../../../components/auth/AuthForm';
import { createServerSupabaseClient } from '../../../lib/supabase/server';

export const metadata: Metadata = {
  title: 'Log In | Tech Trails & Tales',
  description: 'Log in to your account',
};

export default async function LoginPage() {
  // Check if user is already authenticated
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // If user is already logged in, redirect to home page
  if (session) {
    redirect('/');
  }
  
  return <AuthForm type="login" />;
}
