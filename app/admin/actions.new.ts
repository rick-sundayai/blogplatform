'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { isAdminUser } from '@/utils/auth/constants'

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  
  // Verify user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminUser(user.id)) {
    throw new Error('Unauthorized')
  }
  
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const content = formData.get('content') as string
  const excerpt = formData.get('excerpt') as string
  const cover_image = formData.get('cover_image') as string
  const category_id = formData.get('category_id') as string
  const read_time = formData.get('read_time') as string
  const is_published = formData.has('is_published')
  
  const { error } = await supabase.from('posts').insert({
    title,
    slug,
    content,
    excerpt,
    cover_image,
    category_id,
    read_time,
    is_published,
    author_id: user.id,
    published_at: is_published ? new Date().toISOString() : null,
  })
  
  if (error) {
    throw new Error(`Failed to create post: ${error.message}`)
  }
  
  revalidatePath('/admin')
  redirect('/admin')
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient()
  
  // Verify user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminUser(user.id)) {
    throw new Error('Unauthorized')
  }
  
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const content = formData.get('content') as string
  const excerpt = formData.get('excerpt') as string
  const cover_image = formData.get('cover_image') as string
  const category_id = formData.get('category_id') as string
  const read_time = formData.get('read_time') as string
  const is_published = formData.has('is_published')
  
  // Get current post to check if published status changed
  const { data: currentPost } = await supabase
    .from('posts')
    .select('is_published')
    .eq('id', id)
    .single()
  
  const { error } = await supabase
    .from('posts')
    .update({
      title,
      slug,
      content,
      excerpt,
      cover_image,
      category_id,
      read_time,
      is_published,
      updated_at: new Date().toISOString(),
      // Only update published_at if post wasn't published before but is now
      ...(is_published && !currentPost?.is_published 
          ? { published_at: new Date().toISOString() } 
          : {}),
    })
    .eq('id', id)
  
  if (error) {
    throw new Error(`Failed to update post: ${error.message}`)
  }
  
  revalidatePath('/admin')
  redirect('/admin')
}

export async function deletePost(id: string) {
  const supabase = await createClient()
  
  // Verify user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminUser(user.id)) {
    throw new Error('Unauthorized')
  }
  
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)
  
  if (error) {
    throw new Error(`Failed to delete post: ${error.message}`)
  }
  
  revalidatePath('/admin')
  redirect('/admin')
}
