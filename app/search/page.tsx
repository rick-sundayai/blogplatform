import { Metadata } from 'next';
import { searchPosts } from '../../lib/supabase/api';
import SearchResultCard from '../../components/search/SearchResultCard';
import SearchForm from '../../components/common/SearchForm';

// Define the metadata for the search page
export const metadata: Metadata = {
  title: 'Search | Tech Trails & Tales',
  description: 'Search for articles across our blog.',
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

// Search page component
export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Get the search query from URL parameters
  const query = typeof searchParams.q === 'string' ? searchParams.q : '';
  
  // Only search if there's a query
  const posts = query ? await searchPosts(query) : [];
  
  // Map posts to the format expected by PostCard component
  const mappedPosts: PostSummary[] = posts.map(mapPostToPostSummary);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Search Results</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {query ? `Showing results for "${query}"` : 'Search for articles across our blog'}
          </p>
        </div>
        
        {/* Search Form */}
        <div className="max-w-2xl mx-auto">
          <SearchForm initialQuery={query} />
        </div>
      </section>
      
      {/* Search Results */}
      <section className="mb-16">
        {query ? (
          <>
            <h2 className="text-2xl font-bold mb-6">
              {mappedPosts.length === 0
                ? 'No results found'
                : `Found ${mappedPosts.length} ${mappedPosts.length === 1 ? 'result' : 'results'}`}
            </h2>
            
            {mappedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mappedPosts.map((post) => (
                  <SearchResultCard
                    key={post.id}
                    {...post}
                    searchTerm={query}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                  No posts match your search criteria.
                </p>
                <p className="text-gray-500 dark:text-gray-500">
                  Try using different keywords or check out our <a href="/categories" className="text-indigo-600 dark:text-indigo-400 hover:underline">categories</a>.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Enter a search term above to find articles.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
