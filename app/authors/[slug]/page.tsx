import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAuthorBySlug, getPostsByAuthor } from '../../../lib/supabase/api';
import PostCard from '../../../components/blog/PostCard';

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

type Author = {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  bio: string;
  social_links?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
};

// Generate metadata for the page
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const author = await getAuthorBySlug(params.slug);
  
  if (!author) {
    return {
      title: 'Author Not Found',
      description: 'The requested author could not be found.',
    };
  }
  
  return {
    title: `${author.name} | Tech Trails & Tales`,
    description: author.bio,
    openGraph: {
      title: `${author.name} - Tech Trails & Tales`,
      description: author.bio,
      images: [author.avatar],
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

// Author page component
export default async function AuthorPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // Fetch the author
  const author: Author | null = await getAuthorBySlug(params.slug);
  
  // If the author doesn't exist, show a 404 page
  if (!author) {
    notFound();
  }
  
  // Fetch posts by this author
  const posts = await getPostsByAuthor(author.id);
  
  // Map posts to the format expected by PostCard component
  const mappedPosts: PostSummary[] = posts.map(mapPostToPostSummary);
  
  // Parse social links
  const socialLinks = author.social_links || {};
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Author Profile Section */}
      <section className="mb-16">
        <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative h-32 w-32 rounded-full overflow-hidden">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{author.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-3xl">{author.bio}</p>
              
              {/* Social Links */}
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {socialLinks.twitter && (
                  <a 
                    href={socialLinks.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M22 5.8a8.49 8.49 0 0 1-2.36.64 4.13 4.13 0 0 0 1.81-2.27 8.21 8.21 0 0 1-2.61 1 4.1 4.1 0 0 0-7 3.74 11.64 11.64 0 0 1-8.45-4.29 4.16 4.16 0 0 0-.55 2.07 4.09 4.09 0 0 0 1.82 3.41 4.05 4.05 0 0 1-1.86-.51v.05a4.1 4.1 0 0 0 3.3 4 3.93 3.93 0 0 1-1.1.17 4.9 4.9 0 0 1-.77-.07 4.11 4.11 0 0 0 3.83 2.84A8.22 8.22 0 0 1 3 18.34a7.93 7.93 0 0 1-1-.06 11.57 11.57 0 0 0 6.29 1.85A11.59 11.59 0 0 0 20 8.45v-.53a8.43 8.43 0 0 0 2-2.12Z" />
                    </svg>
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a 
                    href={socialLinks.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:text-blue-800 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.3 6.5a1.78 1.78 0 0 1-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                    </svg>
                  </a>
                )}
                {socialLinks.github && (
                  <a 
                    href={socialLinks.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                    </svg>
                  </a>
                )}
                {socialLinks.website && (
                  <a 
                    href={socialLinks.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Author's Posts Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Articles by {author.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mappedPosts.length > 0 ? (
            mappedPosts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No posts found by this author. Check back soon for new content!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
