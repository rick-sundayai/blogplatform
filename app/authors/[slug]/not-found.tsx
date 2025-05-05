import Link from 'next/link';

export default function AuthorNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-6">Author Not Found</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
        Sorry, the author you&apos;re looking for doesn&apos;t exist or may have been removed.
      </p>
      <Link 
        href="/blog" 
        className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
      >
        Browse Articles
      </Link>
    </div>
  );
}
