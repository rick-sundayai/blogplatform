import FeaturedPost from '../components/blog/FeaturedPost';
import PostCard from '../components/blog/PostCard';
import CategoryCard from '../components/blog/CategoryCard';
import NewsletterSubscribe from '../components/common/NewsletterSubscribe';
import Link from 'next/link';
import { getPosts, getCategories, getFeaturedPost } from '../lib/supabase/api';

// Define types for our components
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

interface FeaturedPostType extends PostSummary {
  isFeatured: boolean;
}

interface CategoryCardType {
  name: string;
  slug: string;
  description: string;
  image: string;
  postCount: number;
}

// Define fallback data in case Supabase data is not available
const fallbackFeaturedPost: FeaturedPostType = {
  id: 'featured-post-1',
  title: 'The Future of AI in Software Development',
  slug: 'future-of-ai',
  excerpt: 'Artificial intelligence is revolutionizing how we build and maintain software. From code completion to automated testing, AI tools are becoming essential for modern developers.',
  coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600&auto=format&fit=crop',
  date: 'April 28, 2025',
  author: {
    name: 'Alex Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  category: 'Technology',
  readTime: '8 min read',
  isFeatured: true
};

const fallbackPosts: PostSummary[] = [
  {
    id: 'post-1',
    title: 'Getting Started with Next.js 15',
    slug: 'getting-started-nextjs-15',
    excerpt: 'Learn how to build modern web applications with the latest version of Next.js framework.',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    date: 'April 25, 2025',
    author: {
      name: 'Sarah Miller',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    category: 'Programming',
    readTime: '5 min read',
  },
  {
    id: 'post-2',
    title: 'Mastering TypeScript for React Development',
    slug: 'mastering-typescript-react',
    excerpt: 'Discover how TypeScript can improve your React applications with static type checking.',
    coverImage: 'https://images.unsplash.com/photo-1552308995-2baac1ad5490?q=80&w=800&auto=format&fit=crop',
    date: 'April 22, 2025',
    author: {
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    },
    category: 'Programming',
    readTime: '7 min read',
  },
  {
    id: 'post-3',
    title: 'Designing for Dark Mode: Best Practices',
    slug: 'dark-mode-best-practices',
    excerpt: 'Learn how to create beautiful dark mode interfaces that enhance user experience.',
    coverImage: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop',
    date: 'April 20, 2025',
    author: {
      name: 'Emily Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
    },
    category: 'Design',
    readTime: '6 min read',
  },
];

const fallbackCategories: CategoryCardType[] = [
  {
    name: 'Technology',
    slug: 'technology',
    description: 'Latest news and trends in the tech world',
    postCount: 24,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Programming',
    slug: 'programming',
    description: 'Tutorials and guides for developers',
    postCount: 18,
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Design',
    slug: 'design',
    description: 'UI/UX design principles and inspiration',
    postCount: 12,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'AI & Machine Learning',
    slug: 'ai',
    description: 'Exploring artificial intelligence and ML',
    postCount: 9,
    image: 'https://images.unsplash.com/photo-1677442135136-760c813029fb?q=80&w=800&auto=format&fit=crop',
  },
];

// Define types for database records
type DbPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  published_at: string | null;
  read_time: string;
  authors?: DbAuthor;
  categories?: DbCategory;
};

type DbAuthor = {
  name: string;
  avatar: string;
};

type DbCategory = {
  name: string;
  slug: string;
  description: string;
  image: string;
};

// Convert database post to frontend post format for PostCard component
function mapPostToPostSummary(post: DbPost, author: DbAuthor | undefined, category: DbCategory | undefined): PostSummary {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImage: post.cover_image, // Note: changed from cover_image to coverImage to match component props
    date: post.published_at || 'Draft',
    readTime: post.read_time, // Note: changed from read_time to readTime to match component props
    author: {
      name: author?.name || 'Unknown Author',
      avatar: author?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg',
    },
    category: category?.name || 'Uncategorized',
  };
}

// Convert database featured post to frontend format for FeaturedPost component
function mapToFeaturedPost(post: DbPost, author: DbAuthor | undefined, category: DbCategory | undefined): FeaturedPostType {
  return {
    ...mapPostToPostSummary(post, author, category),
    isFeatured: true,
  };
}

// Convert database category to frontend category card format
function mapToCategoryCard(category: DbCategory, postCount = 0): CategoryCardType {
  return {
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
    postCount,
  };
}

export default async function Home() {
  // Try to fetch data from Supabase, fall back to hardcoded data if not available
  let featuredPostData: FeaturedPostType | undefined;
  let recentPostsData: PostSummary[] = [];
  let categoriesData: CategoryCardType[] = [];
  
  try {
    // Fetch featured post
    const featuredPostResult = await getFeaturedPost();
    if (featuredPostResult) {
      featuredPostData = mapToFeaturedPost(
        featuredPostResult, 
        featuredPostResult.authors, 
        featuredPostResult.categories
      );
    }
    
    // Fetch recent posts
    const postsResult = await getPosts();
    if (postsResult && postsResult.length > 0) {
      recentPostsData = postsResult.slice(0, 3).map((post: DbPost) => 
        mapPostToPostSummary(post, post.authors, post.categories)
      );
    }
    
    // Fetch categories
    const categoriesResult = await getCategories();
    if (categoriesResult && categoriesResult.length > 0) {
      categoriesData = categoriesResult.map((category: DbCategory) => 
        mapToCategoryCard(category, Math.floor(Math.random() * 30))
      );
    }
  } catch (error) {
    console.error('Error fetching data from Supabase:', error);
    // We'll fall back to hardcoded data
  }
  // Use fetched data or fall back to hardcoded data
  const displayFeaturedPost = featuredPostData || fallbackFeaturedPost;
  const displayRecentPosts = recentPostsData.length > 0 ? recentPostsData : fallbackPosts;
  const displayCategories = categoriesData.length > 0 ? categoriesData : fallbackCategories;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tech Trails & Tales</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Exploring the latest in technology, programming, and digital innovation.
          </p>
        </div>
        
        {/* Featured Post */}
        <FeaturedPost {...displayFeaturedPost} />
      </section>
      
      {/* Recent Posts */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Recent Articles</h2>
          <Link href="/blog" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            View all articles →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayRecentPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </section>
      
      {/* Categories */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Browse by Category</h2>
          <Link href="/categories" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            View all categories →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCategories.map((category) => (
            <CategoryCard key={category.slug} {...category} />
          ))}
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="mb-16">
        <div className="max-w-2xl mx-auto">
          <NewsletterSubscribe />
        </div>
      </section>
    </div>
  );
}
