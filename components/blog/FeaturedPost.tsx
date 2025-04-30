'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

interface FeaturedPostProps {
  id: string;
  title: string;
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

const FeaturedPost: FC<FeaturedPostProps> = ({
  id,
  title,
  excerpt,
  coverImage,
  date,
  author,
  category,
  readTime,
}) => {
  return (
    <article className="grid md:grid-cols-2 gap-8 bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md">
      <div className="relative h-64 md:h-full w-full">
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      <div className="p-6 md:p-8 flex flex-col justify-center">
        <div className="flex items-center justify-between mb-4">
          <Link 
            href={`/categories/${category.toLowerCase()}`}
            className="text-sm font-medium px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full"
          >
            {category}
          </Link>
          <span className="text-sm text-gray-500 dark:text-gray-400">{readTime}</span>
        </div>
        <Link href={`/blog/${id}`} className="block">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {title}
          </h2>
        </Link>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{excerpt}</p>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center">
            <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="font-medium">{author.name}</span>
          </div>
          <time className="text-sm text-gray-500 dark:text-gray-400">{date}</time>
        </div>
      </div>
    </article>
  );
};

export default FeaturedPost;
