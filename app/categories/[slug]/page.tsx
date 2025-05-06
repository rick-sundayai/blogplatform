import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getRelatedCategories } from '../../../lib/supabase/api';
import PostCard from '../../../components/blog/PostCard';
import CategoryCard from '../../../components/blog/CategoryCard';
import { getPostsByCategory } from '../../../lib/supabase/api';

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

// Define the category type used by the page component
type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
};

// Generate metadata for the page
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  // Ensure params is properly awaited
  const resolvedParams = await params;
  const category = await getCategoryBySlug(resolvedParams.slug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    };
  }
  
  return {
    title: `${category.name} | Tech Trails & Tales`,
    description: category.description,
    openGraph: {
      title: `${category.name} - Tech Trails & Tales`,
      description: category.description,
      images: [category.image],
    },
  };
}

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

// Category page component
export default async function CategoryPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // Ensure params is properly awaited
  const resolvedParams = await params;
  
  // Fetch the category
  const category: Category | null = await getCategoryBySlug(resolvedParams.slug);
  
  // Fallback image in case the category image is broken
  const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop';
  
  // If the category doesn't exist, show a 404 page
  if (!category) {
    notFound();
  }
  
  // Fetch posts for this category
  const posts = await getPostsByCategory(resolvedParams.slug);
  
  // Fetch related categories
  const relatedCategories = await getRelatedCategories(category.id, 3);
  
  // Map posts to the format expected by PostCard component
  const mappedPosts: PostSummary[] = posts.map(mapPostToPostSummary);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden mb-8">
          <Image
            src={category.image || fallbackImage}
            alt={category.name}
            fill
            className="object-cover"
            priority
            unoptimized // Allow client-side fallback handling
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 md:p-8 w-full">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{category.name}</h1>
              <p className="text-lg text-gray-200 max-w-2xl">{category.description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Articles in {category.name}</h2>
          <Link href="/categories" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            View all categories →
          </Link>
        </div>
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
                No posts found in this category. Check back soon for new content!
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* Related Categories */}
      {relatedCategories.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Related Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedCategories.map((relatedCategory) => (
              <CategoryCard
                key={relatedCategory.id}
                name={relatedCategory.name}
                slug={relatedCategory.slug}
                description={relatedCategory.description}
                image={relatedCategory.image}
                postCount={relatedCategory.postCount || 0}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
