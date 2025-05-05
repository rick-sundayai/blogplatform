import { Metadata } from 'next';
import { getPosts, getCategories } from '../../lib/supabase/api';
import PostCard from '../../components/blog/PostCard';
import CategoryFilter from '../../components/blog/CategoryFilter';

// Define the metadata for the blog index page
export const metadata: Metadata = {
  title: 'Blog | Tech Trails & Tales',
  description: 'Explore our latest articles on technology, programming, and digital innovation.',
};

// Define types for our data
interface PostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  date: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  readTime: string;
}

// Define type for database post
type DbPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  published_at: string | null;
  read_time: string;
  authors?: {
    name: string;
    avatar: string;
  };
  categories?: {
    name: string;
  };
};

// Map database post to frontend format
function mapPostToPostSummary(post: DbPost): PostSummary {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImage: post.cover_image,
    date: post.published_at || 'Draft',
    readTime: post.read_time,
    author: {
      name: post.authors?.name || 'Unknown Author',
      avatar: post.authors?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg',
    },
    category: post.categories?.name || 'Uncategorized',
  };
}

// Blog index page component
export default async function BlogIndex({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Parse category slugs from search params - ensure we're handling it safely
  const categoriesParam = searchParams.categories;
  const categoryFilter = typeof categoriesParam === 'string' ? categoriesParam.split(',') : undefined;
  
  // Fetch all categories for the filter
  const categories = await getCategories();
  
  // Fetch posts filtered by categories if provided
  const posts = await getPosts(categoryFilter);
  
  // Map posts to the format expected by PostCard component
  const mappedPosts: PostSummary[] = posts.map(mapPostToPostSummary);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Exploring the latest in technology, programming, and digital innovation.
          </p>
        </div>
      </section>
      
      {/* Category Filter */}
      <section className="mb-8">
        <CategoryFilter
          categories={categories}
          selectedCategories={categoryFilter}
        />
      </section>
      
      {/* Posts Grid */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mappedPosts.length > 0 ? (
            mappedPosts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No posts found. Check back soon for new content!
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="mb-16 bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get the latest articles, tutorials, and updates delivered straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
