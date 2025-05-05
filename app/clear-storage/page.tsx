'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearAllStorage } from '../../lib/utils/clearStorage';

export default function ClearStoragePage() {
  const [cleared, setCleared] = useState(false);
  const router = useRouter();

  const handleClearStorage = () => {
    clearAllStorage();
    setCleared(true);
    
    // Also clear Supabase session specifically
    try {
      const supabaseKey = Object.keys(localStorage).find(key => 
        key.startsWith('sb-') && key.includes('auth')
      );
      
      if (supabaseKey) {
        console.log(`Cleared Supabase auth key: ${supabaseKey}`);
      }
    } catch (error) {
      console.error('Error clearing Supabase storage:', error);
    }
  };

  const handleGoHome = () => {
    router.push('/');
    router.refresh();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Clear Application Storage</h1>
        
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          This utility will clear all local storage and cookies related to the application.
          Use this if you&apos;re experiencing authentication issues or want to start with a clean state.
        </p>
        
        {cleared ? (
          <div className="mb-6">
            <div className="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 mb-4" role="alert">
              <p>All local storage and cookies have been cleared successfully!</p>
            </div>
            <button
              onClick={handleGoHome}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
            >
              Go to Homepage
            </button>
          </div>
        ) : (
          <button
            onClick={handleClearStorage}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          >
            Clear All Storage
          </button>
        )}
        
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          <p>This will clear:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>All localStorage items</li>
            <li>All cookies</li>
            <li>Supabase authentication data</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
