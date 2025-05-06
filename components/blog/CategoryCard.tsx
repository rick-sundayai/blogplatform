'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FC, useState } from 'react';

interface CategoryCardProps {
  name: string;
  slug: string;
  description: string;
  postCount: number;
  image: string;
}

const CategoryCard: FC<CategoryCardProps> = ({
  name,
  slug,
  description,
  postCount,
  image,
}) => {
  const [imgSrc, setImgSrc] = useState(image);
  
  // Fallback image in case the original image fails to load
  const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop';
  
  // Handle image load error
  const handleImageError = () => {
    setImgSrc(fallbackImage);
  };
  return (
    <Link 
      href={`/categories/${slug}`}
      className="block bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="relative h-36 w-full">
        <Image
          src={imgSrc}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
          <h3 className="text-white text-xl font-bold">{name}</h3>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">{description}</p>
        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
          {postCount} {postCount === 1 ? 'article' : 'articles'}
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;
