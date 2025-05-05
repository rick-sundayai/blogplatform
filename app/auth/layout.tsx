import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Authentication | Tech Trails & Tales',
  description: 'Log in or create an account',
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // We'll handle redirects in the individual pages instead of the layout
  // This makes it easier to have exceptions for pages like reset-password
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h2 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">Tech Trails & Tales</h2>
          </Link>
        </div>
        
        <div className="mt-8 bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
