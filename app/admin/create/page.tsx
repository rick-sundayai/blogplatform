'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/client'
import { createPost } from '../actions'

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  cover_image: z.string().optional(),
  category_id: z.string().min(1, 'Category is required'),
  read_time: z.string().min(1, 'Read time is required'),
  is_published: z.boolean().optional(),
})

type PostFormData = z.infer<typeof postSchema>

type Category = {
  id: string
  name: string
}

export default function CreatePostPage() {
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    cover_image: '',
    category_id: '',
    read_time: '',
    is_published: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const router = useRouter()
  
  const fetchCategories = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from('categories').select('id, name')
      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }, [])
  
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }
  
  const generateSlug = () => {
    if (!formData.title) return
    
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    setFormData(prev => ({ ...prev, slug }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      // Validate form data
      const result = postSchema.safeParse(formData)
      if (!result.success) {
        const fieldErrors: Record<string, string> = {}
        result.error.errors.forEach(error => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message
          }
        })
        setErrors(fieldErrors)
        return
      }
      
      // Create FormData object for server action
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'is_published') {
          if (value) formDataObj.append(key, 'true')
        } else {
          formDataObj.append(key, value as string)
        }
      })
      
      // Submit form using server action
      await createPost(formDataObj)
      
      // Redirect happens in the server action
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      
      {submitError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{submitError}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              onBlur={generateSlug}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.title ? 'border-red-500' : ''}`}
            />
            {errors.title && <p className="text-red-500 text-xs italic mt-1">{errors.title}</p>}
          </div>
          
          <div className="col-span-1">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="slug">
              Slug *
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              value={formData.slug}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.slug ? 'border-red-500' : ''}`}
            />
            {errors.slug && <p className="text-red-500 text-xs italic mt-1">{errors.slug}</p>}
          </div>
          
          <div className="col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              rows={10}
              value={formData.content}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.content ? 'border-red-500' : ''}`}
            />
            {errors.content && <p className="text-red-500 text-xs italic mt-1">{errors.content}</p>}
          </div>
          
          <div className="col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="excerpt">
              Excerpt *
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              value={formData.excerpt}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.excerpt ? 'border-red-500' : ''}`}
            />
            {errors.excerpt && <p className="text-red-500 text-xs italic mt-1">{errors.excerpt}</p>}
          </div>
          
          <div className="col-span-1">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cover_image">
              Cover Image URL
            </label>
            <input
              id="cover_image"
              name="cover_image"
              type="text"
              value={formData.cover_image}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div className="col-span-1">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category_id">
              Category *
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.category_id ? 'border-red-500' : ''}`}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && <p className="text-red-500 text-xs italic mt-1">{errors.category_id}</p>}
          </div>
          
          <div className="col-span-1">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="read_time">
              Read Time (minutes) *
            </label>
            <input
              id="read_time"
              name="read_time"
              type="number"
              min="1"
              value={formData.read_time}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.read_time ? 'border-red-500' : ''}`}
            />
            {errors.read_time && <p className="text-red-500 text-xs italic mt-1">{errors.read_time}</p>}
          </div>
          
          <div className="col-span-1 flex items-center">
            <input
              id="is_published"
              name="is_published"
              type="checkbox"
              checked={formData.is_published}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label className="text-gray-700 font-bold" htmlFor="is_published">
              Publish immediately
            </label>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
