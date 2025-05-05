import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAuthors } from '../../../lib/supabase/api';

export const metadata: Metadata = {
  title: 'Manage Authors | Admin',
  description: 'Manage your blog authors',
};

export default async function AdminAuthors() {
  // Fetch all authors
  const authors = await getAuthors();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Authors</h1>
        <Link 
          href="/admin/authors/new" 
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Author
        </Link>
      </div>
      
      {/* Authors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => (
          <div key={author.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                {author.avatar_url ? (
                  <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
                    <Image 
                      src={author.avatar_url} 
                      alt={author.name} 
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-medium">{author.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{author.slug}</p>
                </div>
              </div>
              
              {author.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {author.bio}
                </p>
              )}
              
              <div className="flex justify-end space-x-2 mt-4">
                <Link 
                  href={`/admin/authors/${author.id}`} 
                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-md text-sm hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                >
                  Edit
                </Link>
                <button 
                  className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-md text-sm hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {authors.length === 0 && (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No authors found. <Link href="/admin/authors/new" className="text-indigo-600 dark:text-indigo-400 hover:underline">Create your first author</Link>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
