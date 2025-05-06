import { createServerSupabaseClient } from './server';

// Team members
export async function getTeamMembers() {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .limit(3);
    
  if (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
  
  return data || [];
}
