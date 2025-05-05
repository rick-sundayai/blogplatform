import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '../../../lib/supabase/api';

// Define types for the post data
type PostAuthor = {
  name: string;
  avatar: string;
  bio?: string;
};

type PostCategory = {
  name: string;
  slug: string;
};

type PostData = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  published_at: string | null;
  read_time: string;
  authors?: PostAuthor;
  categories?: PostCategory;
};

// Generate metadata for the page
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  // In Next.js 14+, we need to await the params object before accessing its properties
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }
  
  return {
    title: `${post.title} | Tech Trails & Tales`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.cover_image],
      type: 'article',
      publishedTime: post.published_at || undefined,
    },
  };
}

// Format the date for display
function formatDate(dateString: string | null): string {
  if (!dateString) return 'Draft';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// Convert markdown to HTML (simple version)
function markdownToHtml(markdown: string): string {
  // This is a very basic implementation
  // For a real app, use a library like remark/rehype or react-markdown
  
  // Convert headings
  let html = markdown
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  
  // Convert paragraphs (simple approach)
  html = html.replace(/^(?!<h[1-6]>)(.+)$/gm, '<p>$1</p>');
  
  // Convert code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  
  // Convert inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Convert bold text
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Convert italic text
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Convert links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Convert lists (simple approach)
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.+<\/li>\n)+/g, '<ul>$&</ul>');
  
  return html;
}

// The blog post page component
export default async function BlogPost({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // In Next.js 14+, we need to await the params object before accessing its properties
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);
  
  // If the post doesn't exist, show a 404 page
  if (!post) {
    notFound();
  }
  
  const {
    title,
    content,
    cover_image,
    published_at,
    read_time,
    authors,
    categories,
  } = post as PostData;
  
  const formattedDate = formatDate(published_at);
  const htmlContent = markdownToHtml(content);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        {/* Back to blog link */}
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to all articles
          </Link>
        </div>
        
        {/* Post header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {categories && (
                <Link 
                  href={`/categories/${categories.slug}`}
                  className="text-sm font-medium px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full"
                >
                  {categories.name}
                </Link>
              )}
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-4">{read_time}</span>
            </div>
            <time className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</time>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{title}</h1>
          
          {/* Author info */}
          {authors && (
            <div className="flex items-center mt-6">
              <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                <Image
                  src={authors.avatar}
                  alt={authors.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-medium">{authors.name}</div>
                {authors.bio && <div className="text-sm text-gray-600 dark:text-gray-400">{authors.bio}</div>}
              </div>
            </div>
          )}
        </header>
        
        {/* Featured image */}
        <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={cover_image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Post content */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none blog-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        
        {/* Tags and sharing (placeholder) */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
              <span className="text-gray-600 dark:text-gray-400">Tags:</span>
              <Link href="/tags/nextjs" className="text-indigo-600 dark:text-indigo-400 hover:underline">#nextjs</Link>
              <Link href="/tags/react" className="text-indigo-600 dark:text-indigo-400 hover:underline">#react</Link>
              <Link href="/tags/webdev" className="text-indigo-600 dark:text-indigo-400 hover:underline">#webdev</Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 dark:text-gray-400">Share:</span>
              <button aria-label="Share on Twitter" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </button>
              <button aria-label="Share on Facebook" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </button>
              <button aria-label="Share by Email" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
