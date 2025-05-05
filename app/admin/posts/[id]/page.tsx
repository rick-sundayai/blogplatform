import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PostForm from '../components/PostForm';
import { getPostById } from '../../../../lib/supabase/api';

export const metadata: Metadata = {
  title: 'Edit Post | Admin',
  description: 'Edit an existing blog post',
};

export default async function EditPost({ params }: { params: { id: string } }) {
  const { id } = params;
  
  // Fetch the post data
  const post = await getPostById(id);
  
  // If post not found, show 404
  if (!post) {
    notFound();
  }
  
  // Format the post data for the form
  const initialData = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content || '',
    featured_image: post.featured_image || '',
    author_id: post.author_id,
    category_id: post.category_id,
    is_published: post.is_published,
    published_at: post.published_at || '',
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <PostForm postId={id} initialData={initialData} />
    </div>
  );
}
