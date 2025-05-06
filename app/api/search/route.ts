import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }
  
  try {
    const supabase = await createServerSupabaseClient();
    
    // Search in posts table
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select(`
        *,
        authors(*),
        categories(*)
      `)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .eq('is_published', true)
      .order('published_at', { ascending: false });
      
    if (postsError) {
      console.error('Error searching posts:', postsError);
      return NextResponse.json({ error: 'Failed to search posts' }, { status: 500 });
    }
    
    return NextResponse.json({ results: posts || [] });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
