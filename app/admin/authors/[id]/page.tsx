import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AuthorForm from '../components/AuthorForm';
import { getAuthorById } from '../../../../lib/supabase/api';

export const metadata: Metadata = {
  title: 'Edit Author | Admin',
  description: 'Edit an existing blog author',
};

export default async function EditAuthor({ params }: { params: { id: string } }) {
  const { id } = params;
  
  // Fetch the author data
  const author = await getAuthorById(id);
  
  // If author not found, show 404
  if (!author) {
    notFound();
  }
  
  // Format the author data for the form
  const initialData = {
    name: author.name,
    slug: author.slug,
    bio: author.bio || '',
    avatar_url: author.avatar_url || '',
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Author</h1>
      <AuthorForm authorId={id} initialData={initialData} />
    </div>
  );
}
