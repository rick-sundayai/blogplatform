'use client';

import Link from 'next/link';
import { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '../../lib/supabase/client';
import ThemeToggle from '../common/ThemeToggle';
import SearchBar from '../common/SearchBar';
import MobileMenu from './MobileMenu';

const Header: FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  
  // Initialize Supabase client
  const supabase = getSupabase();
  
  useEffect(() => {
    // Check if user is logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    
    checkSession();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setIsLoggedIn(true);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
      }
    });
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Remove supabase.auth from dependency array as it's a stable reference
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };
  return (
    <header className="py-6 border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tight hover:text-indigo-600 transition-colors">
          Tech Trails & Tales
        </Link>
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Home
          </Link>
          <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Blog
          </Link>
          <Link href="/categories" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Categories
          </Link>
          <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            About
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <div className="hidden md:block w-64">
            <SearchBar />
          </div>
          <ThemeToggle />
          {isLoggedIn ? (
            <button
              onClick={handleSignOut}
              className="hidden md:block px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Log Out
            </button>
          ) : (
            <Link href="/auth/login" className="hidden md:block px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
              Log In
            </Link>
          )}
          <button
            className="md:hidden p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open mobile menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
};

export default Header;
