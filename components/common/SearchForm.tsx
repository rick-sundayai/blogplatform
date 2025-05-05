'use client';

import { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SearchFormProps {
  initialQuery?: string;
  large?: boolean;
}

const SearchForm: FC<SearchFormProps> = ({ initialQuery = '', large = false }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);

  // Update local state when initialQuery prop changes
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Navigate to search results page
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    
    // Small delay to show loading state
    setTimeout(() => {
      setIsSearching(false);
    }, 300);
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles..."
          className={`w-full px-4 ${large ? 'py-3 text-lg' : 'py-2'} pl-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          aria-label="Search"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className={`${large ? 'h-6 w-6' : 'h-5 w-5'} text-gray-400`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        {isSearching ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className={`animate-spin ${large ? 'h-6 w-6' : 'h-5 w-5'} text-indigo-600`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            aria-label="Submit search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`${large ? 'h-6 w-6' : 'h-5 w-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchForm;
