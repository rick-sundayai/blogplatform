'use client';

import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Author {
  id: string;
  name: string;
  avatar: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
  read_time: string;
  authors: Author;
  categories: Category;
}

const SearchPage: FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setResults([]);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        
        const data = await response.json();
        setResults(data.results);
      } catch (err) {
        console.error('Search error:', err);
        setError('An error occurred while searching. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {query ? `Showing results for "${query}"` : 'Enter a search term to find articles'}
        </p>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : results.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {query ? `We couldn't find any articles matching "${query}"` : 'Try searching for a topic, keyword, or phrase'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {results.map((post) => (
              <article key={post.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between text-sm mb-3">
                    <Link 
                      href={`/categories/${post.categories.slug}`}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {post.categories.name}
                    </Link>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{post.read_time}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="block">
                    <h2 className="text-xl font-bold mb-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden mr-3">
                        <Image
                          src={post.authors.avatar}
                          alt={post.authors.name}
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      </div>
                      <span className="text-sm font-medium">{post.authors.name}</span>
                    </div>
                    <time className="text-sm text-gray-500 dark:text-gray-400">{formatDate(post.published_at)}</time>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
