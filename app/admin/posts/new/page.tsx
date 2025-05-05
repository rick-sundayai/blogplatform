import { Metadata } from 'next';
import PostForm from '../components/PostForm';

export const metadata: Metadata = {
  title: 'Create New Post | Admin',
  description: 'Create a new blog post',
};

export default function NewPost() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <PostForm />
    </div>
  );
}
