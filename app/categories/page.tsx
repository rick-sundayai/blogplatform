import { Metadata } from 'next';
import { getCategories } from '../../lib/supabase/api';
import CategoryCard from '../../components/blog/CategoryCard';

// Define the metadata for the categories index page
export const metadata: Metadata = {
  title: 'Categories | Tech Trails & Tales',
  description: 'Browse our blog categories to find content that interests you.',
};

// Categories index page component
export default async function CategoriesIndex() {
  // Fetch all categories
  const categories = await getCategories();
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Categories</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Browse our content by topic to find articles that interest you.
          </p>
        </div>
      </section>
      
      {/* Categories Grid */}
      <section className="mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.length > 0 ? (
            categories.map((category) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                slug={category.slug}
                description={category.description}
                image={category.image}
                postCount={category.postCount || 0}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No categories found. Check back soon for new content!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
