'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { isAdminUser } from '@/utils/auth/constants'
import { User, Session } from '@supabase/supabase-js'

export default function DebugPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  
  useEffect(() => {
    async function checkAuth() {
      try {
        setLoading(true)
        const supabase = createClient()
        
        // Get current session
        const { data: sessionData } = await supabase.auth.getSession()
        setSession(sessionData.session)
        
        // Get current user
        const { data: userData } = await supabase.auth.getUser()
        setUser(userData.user)
        
        console.log('Debug page auth check:', {
          session: sessionData.session,
          user: userData.user
        })
      } catch (error) {
        console.error('Debug page error:', error)
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [])
  
  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.reload()
  }
  
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700 dark:text-indigo-300">Authentication Debug Page</h1>
      
      {loading ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mr-3"></div>
            <p>Loading authentication data...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700 dark:text-indigo-300">Authentication Status</h2>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-600">
              <p className="mb-2">
                <span className="font-medium">Authenticated:</span>{' '}
                <span className={user ? 'text-green-600' : 'text-red-600'}>
                  {user ? 'Yes' : 'No'}
                </span>
              </p>
              
              {user && (
                <>
                  <p className="mb-2">
                    <span className="font-medium">User ID:</span> {user.id}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Is Admin:</span>{' '}
                    <span className={isAdminUser(user.id) ? 'text-green-600' : 'text-red-600'}>
                      {isAdminUser(user.id) ? 'Yes' : 'No'}
                    </span>
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Email Confirmed:</span>{' '}
                    <span className={user.email_confirmed_at ? 'text-green-600' : 'text-yellow-600'}>
                      {user.email_confirmed_at ? 'Yes' : 'No'}
                    </span>
                  </p>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700 dark:text-indigo-300">Session Information</h2>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-600">
              <p className="mb-2">
                <span className="font-medium">Active Session:</span>{' '}
                <span className={session ? 'text-green-600' : 'text-red-600'}>
                  {session ? 'Yes' : 'No'}
                </span>
              </p>
              
              {session && (
                <>
                  <p className="mb-2">
                    <span className="font-medium">Session ID:</span> {session.access_token.substring(0, 8)}...
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Created At:</span>{' '}
                    {new Date().toLocaleString()}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Expires At:</span>{' '}
                    {session.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'Unknown'}
                  </p>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700 dark:text-indigo-300">Actions</h2>
            <div className="space-x-4">
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                Sign Out
              </button>
              <a
                href="/login"
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 py-2 rounded-md inline-block transition-colors duration-200"
              >
                Go to Login
              </a>
              <a
                href="/admin"
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 py-2 rounded-md inline-block transition-colors duration-200"
              >
                Try Admin Access
              </a>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700 dark:text-indigo-300">Raw Data</h2>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md overflow-auto max-h-96 border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-medium mb-2">User Object:</h3>
              <pre className="text-sm text-gray-800 dark:text-gray-200">{JSON.stringify(user, null, 2)}</pre>
              
              <h3 className="text-lg font-medium mt-4 mb-2">Session Object:</h3>
              <pre className="text-sm text-gray-800 dark:text-gray-200">{JSON.stringify(session, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
