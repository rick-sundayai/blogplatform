import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '../../lib/supabase/server';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Tech Trails & Tales',
  description: 'Manage your blog content',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the current user
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // If no session, redirect to login
  if (!session) {
    redirect('/auth/login?callbackUrl=/admin/dashboard');
  }
  
  // Check if user has admin role (you would implement this based on your auth setup)
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id)
    .single();
  
  const isAdmin = userRole?.role === 'admin';
  
  // If not admin, redirect to homepage
  if (!isAdmin) {
    redirect('/');
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-md fixed h-full">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <Link href="/admin/dashboard" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              Admin Dashboard
            </Link>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/admin/dashboard" 
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/posts" 
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  Posts
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/categories" 
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                  Categories
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/authors" 
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Authors
                </Link>
              </li>
              <li className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <Link 
                  href="/" 
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  View Site
                </Link>
              </li>
              <li>
                <form action="/auth/signout" method="post">
                  <button 
                    type="submit"
                    className="w-full flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414a1 1 0 00-.293-.707L11.414 2.414A1 1 0 0010.707 2H4a1 1 0 00-1 1zm9 2.5V5a1 1 0 01-1-1h-3a1 1 0 000 2h3zm-3 2a1 1 0 100 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h6a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Sign Out
                  </button>
                </form>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Main content */}
        <main className="ml-64 flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
