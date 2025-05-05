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

export async function getCategoryById(id: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
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

export async function getAuthorBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .eq('slug', slug)
    .single();
    
  if (error) {
    console.error(`Error fetching author with slug ${slug}:`, error);
    return null;
  }
  
  return data;
}



export async function getPostsByAuthor(authorId: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      authors(*),
      categories(*)
    `)
    .eq('author_id', authorId)
    .eq('is_published', true)
    .order('published_at', { ascending: false });
    
  if (error) {
    console.error(`Error fetching posts for author ${authorId}:`, error);
    return [];
  }
  
  return data || [];
}

// Search functionality
export async function searchPosts(query: string) {
  const supabase = await createServerSupabaseClient();
  
  // Get all posts
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      authors(*),
      categories(*)
    `)
    .eq('is_published', true);
    
  if (error) {
    console.error('Error searching posts:', error);
    return [];
  }
  
  if (!data || data.length === 0) {
    return [];
  }
  
  // Filter posts by search term
  const searchTerm = query.toLowerCase();
  const filteredPosts = data.filter(post => {
    const titleMatch = post.title.toLowerCase().includes(searchTerm);
    const contentMatch = post.content?.toLowerCase().includes(searchTerm);
    const excerptMatch = post.excerpt.toLowerCase().includes(searchTerm);
    const categoryMatch = post.categories?.name.toLowerCase().includes(searchTerm);
    const authorMatch = post.authors?.name.toLowerCase().includes(searchTerm);
    
    return titleMatch || contentMatch || excerptMatch || categoryMatch || authorMatch;
  });
  
  return filteredPosts;
}

// Admin API Functions

// Get post by ID (for editing)
export async function getPostById(id: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      authors(*),
      categories(*)
    `)
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching post with ID ${id}:`, error);
    return null;
  }
  
  return data;
}

// Define types for our data models
export type PostData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  author_id: string;
  category_id: string;
  is_published: boolean;
  published_at?: string;
};

export type CategoryData = {
  name: string;
  slug: string;
  description?: string;
};

export type AuthorData = {
  name: string;
  slug: string;
  bio?: string;
  avatar_url?: string;
};

// Create a new post
export async function createPost(postData: PostData) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('posts')
    .insert([postData])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating post:', error);
    throw error;
  }
  
  return data;
}

// Update an existing post
export async function updatePost(id: string, postData: Partial<PostData>) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('posts')
    .update(postData)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error(`Error updating post with ID ${id}:`, error);
    throw error;
  }
  
  return data;
}

// Delete a post
export async function deletePost(id: string) {
  const supabase = await createServerSupabaseClient();
  
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error(`Error deleting post with ID ${id}:`, error);
    throw error;
  }
  
  return true;
}

// Create a new category
export async function createCategory(categoryData: CategoryData) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('categories')
    .insert([categoryData])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating category:', error);
    throw error;
  }
  
  return data;
}

// Update an existing category
export async function updateCategory(id: string, categoryData: Partial<CategoryData>) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('categories')
    .update(categoryData)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error(`Error updating category with ID ${id}:`, error);
    throw error;
  }
  
  return data;
}

// Delete a category
export async function deleteCategory(id: string) {
  const supabase = await createServerSupabaseClient();
  
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error(`Error deleting category with ID ${id}:`, error);
    throw error;
  }
  
  return true;
}

// Create a new author
export async function createAuthor(authorData: AuthorData) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('authors')
    .insert([authorData])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating author:', error);
    throw error;
  }
  
  return data;
}

// Update an existing author
export async function updateAuthor(id: string, authorData: Partial<AuthorData>) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('authors')
    .update(authorData)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error(`Error updating author with ID ${id}:`, error);
    throw error;
  }
  
  return data;
}

// Delete an author
export async function deleteAuthor(id: string) {
  const supabase = await createServerSupabaseClient();
  
  const { error } = await supabase
    .from('authors')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error(`Error deleting author with ID ${id}:`, error);
    throw error;
  }
  
  return true;
}

// Get user role
export async function getUserRole(userId: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();
    
  if (error) {
    console.error(`Error fetching role for user ${userId}:`, error);
    return null;
  }
  
  return data?.role || null;
}
