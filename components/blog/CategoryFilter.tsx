'use client';

import { FC } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface CategoryFilterProps {
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
  selectedCategories?: string[];
}

const CategoryFilter: FC<CategoryFilterProps> = ({ categories, selectedCategories = [] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const toggleCategory = (slug: string) => {
    // Create a new array based on the current selectedCategories
    const newSelected = selectedCategories.includes(slug)
      ? selectedCategories.filter((cat: string) => cat !== slug)
      : [...selectedCategories, slug];
    
    // Create new URL with updated query params
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSelected.length > 0) {
      params.set('categories', newSelected.join(','));
    } else {
      params.delete('categories');
    }
    
    router.push(`/blog?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('categories');
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-3">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => toggleCategory(category.slug)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedCategories.includes(category.slug) 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            {category.name}
          </button>
        ))}
        {selectedCategories.length > 0 && (
          <button
            onClick={clearFilters}
            className="px-3 py-1 rounded-full text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;
