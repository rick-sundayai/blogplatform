import { Metadata } from 'next';
import { getAuthors } from '../../lib/supabase/api';
import AuthorCard from '../../components/blog/AuthorCard';

// Define the metadata for the authors index page
export const metadata: Metadata = {
  title: 'Authors | Tech Trails & Tales',
  description: 'Meet the talented writers behind our articles.',
};

// Authors index page component
export default async function AuthorsIndex() {
  // Fetch all authors
  const authors = await getAuthors();
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Authors</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Meet the talented writers who share their knowledge and insights on our platform.
          </p>
        </div>
      </section>
      
      {/* Authors Grid */}
      <section className="mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {authors.length > 0 ? (
            authors.map((author) => (
              <AuthorCard
                key={author.id}
                id={author.id}
                name={author.name}
                slug={author.slug}
                avatar={author.avatar}
                bio={author.bio}
                socialLinks={author.social_links}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No authors found. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
