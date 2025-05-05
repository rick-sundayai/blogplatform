import { Metadata } from 'next';
import CategoryForm from '../components/CategoryForm';

export const metadata: Metadata = {
  title: 'Create New Category | Admin',
  description: 'Create a new blog category',
};

export default function NewCategory() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create New Category</h1>
      <CategoryForm />
    </div>
  );
}
