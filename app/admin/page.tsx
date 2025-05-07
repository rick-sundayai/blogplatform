import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

// Define types for our data structure
type Category = {
  name: string;
}

type Post = {
  id: string;
  title: string;
  is_published: boolean;
  published_at: string | null;
  categories: Category | null;
}

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  const { data: postsData } = await supabase
    .from('posts')
    .select('id, title, is_published, published_at, categories(name)')
    .order('created_at', { ascending: false })
    
  // Properly type the posts data
  const posts = postsData as unknown as Post[]
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">Manage Posts</h1>
        <Link
          href="/admin/create"
          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          Create New Post
        </Link>
      </div>
      
      {!posts || posts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow text-center border-l-4 border-indigo-500">
          <p className="text-gray-700 dark:text-gray-300">No posts found. Create your first post!</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Published Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800 dark:text-gray-200">{post.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{post.categories?.name || 'Uncategorized'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      post.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Not published'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/edit/${post.id}`} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4">
                      Edit
                    </Link>
                    <Link href={`/admin/delete/${post.id}`} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                      Delete
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
