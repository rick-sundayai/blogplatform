import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryForm from '../components/CategoryForm';
import { getCategoryById } from '../../../../lib/supabase/api';

export const metadata: Metadata = {
  title: 'Edit Category | Admin',
  description: 'Edit an existing blog category',
};

export default async function EditCategory({ params }: { params: { id: string } }) {
  const { id } = params;
  
  // Fetch the category data
  const category = await getCategoryById(id);
  
  // If category not found, show 404
  if (!category) {
    notFound();
  }
  
  // Format the category data for the form
  const initialData = {
    name: category.name,
    slug: category.slug,
    description: category.description || '',
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
      <CategoryForm categoryId={id} initialData={initialData} />
    </div>
  );
}
