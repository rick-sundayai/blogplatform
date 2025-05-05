import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase/server';

export async function POST() {
  const supabase = await createServerSupabaseClient();
  
  // Sign out the user
  await supabase.auth.signOut();
  
  // Redirect to the homepage
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
}
