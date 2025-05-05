'use client';

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface SearchResultCardProps {
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
  searchTerm?: string;
}

const SearchResultCard: FC<SearchResultCardProps> = ({
  // id is kept in props but not used directly in the component
  title,
  slug,
  excerpt,
  coverImage,
  date,
  author,
  category,
  readTime,
  searchTerm = '',
}) => {
  // Function to highlight the search term in text
  const highlightText = (text: string, term: string) => {
    if (!term.trim()) return text;
    
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">{part}</mark> : part
    );
  };

  return (
    <article className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <Link href={`/blog/${slug}`} className="block">
        <div className="relative h-48 w-full">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-4">
              <span className="text-xs font-medium px-2 py-1 bg-indigo-600 text-white rounded-full">
                {category}
              </span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/blog/${slug}`} className="block">
          <h2 className="text-xl font-bold mb-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {searchTerm ? highlightText(title, searchTerm) : title}
          </h2>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {searchTerm ? highlightText(excerpt, searchTerm) : excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm font-medium">{author.name}</span>
          </div>
          
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <span className="mr-2">{date}</span>
            <span>{readTime}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default SearchResultCard;
