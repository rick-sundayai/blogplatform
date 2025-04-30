import FeaturedPost from '../components/blog/FeaturedPost';
import PostCard from '../components/blog/PostCard';
import CategoryCard from '../components/blog/CategoryCard';
import NewsletterSubscribe from '../components/common/NewsletterSubscribe';
import Link from 'next/link';

// Placeholder data - this would come from Supabase in a real application
const featuredPost = {
  id: 'featured-post-1',
  title: 'The Future of AI in Software Development',
  excerpt: 'Artificial intelligence is revolutionizing how we build and maintain software. From code completion to automated testing, AI tools are becoming essential for modern developers.',
  coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600&auto=format&fit=crop',
  date: 'April 28, 2025',
  author: {
    name: 'Alex Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  category: 'Technology',
  readTime: '8 min read',
};

const recentPosts = [
  {
    id: 'post-1',
    title: 'Getting Started with Next.js 15',
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

const categories = [
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

export default function Home() {
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
        <FeaturedPost {...featuredPost} />
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
          {recentPosts.map((post) => (
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
          {categories.map((category) => (
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
