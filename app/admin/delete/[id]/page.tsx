'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { deletePost } from '../../actions'

export default function DeletePostPage({ params }: { params: { id: string } }) {
  // Get the ID from params
  const { id } = params
  const [post, setPost] = useState<{ id: string; title: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Redirection is handled by the server action after delete
  
  const fetchPost = useCallback(async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('posts')
        .select('id, title')
        .eq('id', id)
        .single()
      
      if (error) throw error
      if (!data) throw new Error('Post not found')
      
      setPost(data)
    } catch (error) {
      console.error('Error fetching post:', error)
      setError(error instanceof Error ? error.message : 'Failed to load post')
    } finally {
      setIsLoading(false)
    }
  }, [id])
  
  useEffect(() => {
    fetchPost()
  }, [fetchPost])
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deletePost(id)
      // Redirect happens in the server action
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete post')
      setIsDeleting(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <div className="mt-4">
          <Link href="/admin" className="text-blue-500 hover:underline">
            Return to Admin Dashboard
          </Link>
        </div>
      </div>
    )
  }
  
  if (!post) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md">
        <p className="font-bold">Post Not Found</p>
        <p>The post you are trying to delete could not be found.</p>
        <div className="mt-4">
          <Link href="/admin" className="text-blue-500 hover:underline">
            Return to Admin Dashboard
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Delete Post</h1>
      
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6">
        <p className="font-bold">Warning</p>
        <p>You are about to delete the post &ldquo;{post.title}&rdquo;. This action cannot be undone.</p>
      </div>
      
      <div className="flex justify-end mt-6">
        <Link
          href="/admin"
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
        >
          Cancel
        </Link>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Delete Post'}
        </button>
      </div>
    </div>
  )
}
