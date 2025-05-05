import { Metadata } from 'next';
import AuthorForm from '../components/AuthorForm';

export const metadata: Metadata = {
  title: 'Create New Author | Admin',
  description: 'Create a new blog author',
};

export default function NewAuthor() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create New Author</h1>
      <AuthorForm />
    </div>
  );
}
