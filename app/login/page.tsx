'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { isAdminUser } from '@/utils/auth/constants'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectedFrom') || '/admin'
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    console.log('[Login] Login attempt:', { email })
    
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      console.log('[Login] Auth response:', { 
        success: !error,
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
          isAdmin: isAdminUser(data.user.id)
        } : null,
        error: error ? error.message : null
      })
      
      if (error) throw error
      
      // Check if the user is the admin
      if (!isAdminUser(data.user?.id)) {
        console.log('[Login] Not admin user, access denied')
        throw new Error('Not authorized to access admin area')
      }
      
      console.log('[Login] Admin login successful, redirecting to:', redirectTo)
      
      // Use router.replace instead of push to avoid browser history issues
      router.replace(redirectTo)
      router.refresh()
    } catch (error: unknown) {
      console.error('[Login] Login error:', error instanceof Error ? error.message : 'Unknown error')
      setError(error instanceof Error ? error.message : 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-16 flex justify-center bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center text-indigo-600 dark:text-indigo-400">Admin Login</h1>
        
        <form onSubmit={handleLogin} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 border-l-4 border-indigo-500">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50 transition-colors duration-200"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  )
}
