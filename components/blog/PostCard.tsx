'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

interface PostCardProps {
  id: string;
  title: string;
  slug: string; // Add slug property for URL routing
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

const PostCard: FC<PostCardProps> = ({
  // id is kept in props but not used directly in the component
  title,
  slug,
  excerpt,
  coverImage,
  date,
  author,
  category,
  readTime,
}) => {
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
        </div>
      </Link>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Link 
            href={`/categories/${category.toLowerCase()}`}
            className="text-xs font-medium px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full"
          >
            {category}
          </Link>
          <span className="text-xs text-gray-500 dark:text-gray-400">{readTime}</span>
        </div>
        <Link href={`/blog/${slug}`} className="block">
          <h2 className="text-xl font-bold mb-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {title}
          </h2>
        </Link>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative h-8 w-8 rounded-full overflow-hidden mr-3">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                className="object-cover"
                sizes="32px" // Fixed size for avatar (8 * 8 = 32px)
              />
            </div>
            <span className="text-sm font-medium">{author.name}</span>
          </div>
          <time className="text-sm text-gray-500 dark:text-gray-400">{date}</time>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
