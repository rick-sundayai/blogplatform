import { createServerSupabaseClient } from './server';

// Posts
export async function getPosts(categorySlugs?: string[]) {
  const supabase = await createServerSupabaseClient();
  
  let query = supabase
    .from('posts')
    .select(`
      *,
      authors(*),
      categories(*)
    `)
    .eq('is_published', true);
  
  // If category slugs are provided, filter by those categories
  if (categorySlugs && categorySlugs.length > 0) {
    // First, get the category IDs from the slugs
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id')
      .in('slug', categorySlugs);
      
    if (categoriesError) {
      console.error('Error fetching categories by slugs:', categoriesError);
    } else if (categories && categories.length > 0) {
      // Get the category IDs
      const categoryIds = categories.map(cat => cat.id);
      // Filter posts by these category IDs
      query = query.in('category_id', categoryIds);
    }
  }
  
  // Execute the query with ordering
  const { data, error } = await query.order('published_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  
  return data || [];
}

export async function getPostBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      authors(*),
      categories(*)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
    
  if (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
  
  return data;
}

export async function getFeaturedPost() {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      authors(*),
      categories(*)
    `)
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(1)
    .single();
    
  if (error) {
    console.error('Error fetching featured post:', error);
    return null;
  }
  
  return data;
}

// Posts by Category
export async function getPostsByCategory(categorySlug: string) {
  const supabase = await createServerSupabaseClient();
  
  // First, get the category ID
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();
    
  if (categoryError || !category) {
    console.error(`Error fetching category with slug ${categorySlug}:`, categoryError);
    return [];
  }
  
  // Then, get all posts with this category ID
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      authors(*),
      categories(*)
    `)
    .eq('category_id', category.id)
    .eq('is_published', true)
    .order('published_at', { ascending: false });
    
  if (error) {
    console.error(`Error fetching posts for category ${categorySlug}:`, error);
    return [];
  }
  
  return data || [];
}

// Categories
export async function getCategories() {
  const supabase = await createServerSupabaseClient();
  
  // First get all categories
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*');
    
  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError);
    return [];
  }
  
  if (!categories || categories.length === 0) {
    return [];
  }
  
  // Then get post counts for each category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
      const { count, error: countError } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id)
        .eq('is_published', true);
        
      if (countError) {
        console.error(`Error counting posts for category ${category.name}:`, countError);
        return { ...category, postCount: 0 };
      }
      
      return { ...category, postCount: count || 0 };
    })
  );
  
  return categoriesWithCounts;
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();
    
  if (error) {
    console.error(`Error fetching category with slug ${slug}:`, error);
    return null;
  }
  
  return data;
}

export async function getRelatedCategories(categoryId: string, limit: number = 3) {
  const supabase = await createServerSupabaseClient();
  
  // Get all categories except the current one
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .neq('id', categoryId)
    .limit(limit);
    
  if (error) {
    console.error(`Error fetching related categories for ${categoryId}:`, error);
    return [];
  }
  
  // Add post counts to each category
  const categoriesWithCounts = await Promise.all(
    (categories || []).map(async (category) => {
      const { count, error: countError } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id)
        .eq('is_published', true);
        
      if (countError) {
        console.error(`Error counting posts for category ${category.name}:`, countError);
        return { ...category, postCount: 0 };
      }
      
      return { ...category, postCount: count || 0 };
    })
  );
  
  return categoriesWithCounts;
}

// Authors
export async function getAuthors() {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('authors')
    .select('*');
    
  if (error) {
    console.error('Error fetching authors:', error);
    return [];
  }
  
  return data || [];
}

export async function getAuthorById(id: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching author with id ${id}:`, error);
    return null;
  }
  
  return data;
}
