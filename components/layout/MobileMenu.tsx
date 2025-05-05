'use client';

import { FC } from 'react';
import Link from 'next/link';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-75 flex justify-end">
      <div className="w-4/5 max-w-sm bg-white dark:bg-gray-900 h-full shadow-xl flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">Menu</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-4">
            <li>
              <Link 
                href="/" 
                className="block py-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                onClick={onClose}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/blog" 
                className="block py-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                onClick={onClose}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link 
                href="/categories" 
                className="block py-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                onClick={onClose}
              >
                Categories
              </Link>
            </li>
            <li>
              <Link 
                href="/search" 
                className="block py-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                onClick={onClose}
              >
                Search
              </Link>
            </li>
            <li>
              <Link 
                href="/about" 
                className="block py-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                onClick={onClose}
              >
                About
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <Link 
            href="/auth/login"
            className="block w-full text-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            onClick={onClose}
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
