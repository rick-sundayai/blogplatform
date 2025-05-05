"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { getCategories, getAuthors } from '../../../../lib/supabase/api';

// Define the Post schema using Zod for validation
const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  featured_image: z.string().optional(),
  author_id: z.string().min(1, 'Author is required'),
  category_id: z.string().min(1, 'Category is required'),
  is_published: z.boolean().default(false),
  published_at: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

type PostFormProps = {
  postId?: string;
  initialData?: PostFormData;
};

export default function PostForm({ postId, initialData }: PostFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<PostFormData>(initialData || {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    author_id: '',
    category_id: '',
    is_published: false,
    published_at: '',
  });
  
  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  
  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, authorsData] = await Promise.all([
          getCategories(),
          getAuthors()
        ]);
        
        setCategories(categoriesData);
        setAuthors(authorsData);
        
        // If there's an initial featured image, set the preview
        if (initialData?.featured_image) {
          setPreviewImage(initialData.featured_image);
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };
    
    fetchData();
  }, [initialData]);
  
  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
      .trim();
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
    
    // If publishing, set the published_at date
    if (name === 'is_published' && checked) {
      setFormData(prev => ({
        ...prev,
        published_at: new Date().toISOString()
      }));
    }
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsSubmitting(true);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `featured-images/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);
      
      if (error) throw error;
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);
      
      const imageUrl = publicUrlData.publicUrl;
      
      // Update form data and preview
      setFormData(prev => ({
        ...prev,
        featured_image: imageUrl
      }));
      setPreviewImage(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      const validatedData = postSchema.parse(formData);
      setErrors({});
      setIsSubmitting(true);
      
      // Determine if we're creating or updating
      const isEditing = !!postId;
      
      // Prepare the data for Supabase
      const postData = {
        ...validatedData,
        updated_at: new Date().toISOString(),
      };
      
      let result;
      
      if (isEditing) {
        // Update existing post
        result = await supabase
          .from('posts')
          .update(postData)
          .eq('id', postId)
          .select()
          .single();
      } else {
        // Create new post
        result = await supabase
          .from('posts')
          .insert([postData])
          .select()
          .single();
      }
      
      if (result.error) throw result.error;
      
      // Redirect to the posts list
      router.push('/admin/posts');
      router.refresh();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        // Handle other errors
        console.error('Error submitting form:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Title */}
        <div className="col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleTitleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            placeholder="Enter post title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>
        
        {/* Slug */}
        <div className="col-span-2 md:col-span-1">
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Slug
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${errors.slug ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            placeholder="post-url-slug"
          />
          {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
        </div>
        
        {/* Author */}
        <div className="col-span-2 md:col-span-1">
          <label htmlFor="author_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Author
          </label>
          <select
            id="author_id"
            name="author_id"
            value={formData.author_id}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${errors.author_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
          >
            <option value="">Select an author</option>
            {authors.map(author => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
          {errors.author_id && <p className="mt-1 text-sm text-red-600">{errors.author_id}</p>}
        </div>
        
        {/* Category */}
        <div className="col-span-2 md:col-span-1">
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${errors.category_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
        </div>
        
        {/* Featured Image */}
        <div className="col-span-2">
          <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Featured Image
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              id="featured_image_upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <input
              type="text"
              id="featured_image"
              name="featured_image"
              value={formData.featured_image}
              onChange={handleChange}
              className={`flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${errors.featured_image ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              placeholder="Image URL or upload"
            />
            <label
              htmlFor="featured_image_upload"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Upload
            </label>
          </div>
          {errors.featured_image && <p className="mt-1 text-sm text-red-600">{errors.featured_image}</p>}
          
          {/* Image Preview */}
          {previewImage && (
            <div className="mt-4">
              <img 
                src={previewImage} 
                alt="Featured image preview" 
                className="max-h-48 rounded-md object-cover" 
              />
            </div>
          )}
        </div>
        
        {/* Excerpt */}
        <div className="col-span-2">
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${errors.excerpt ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            placeholder="Brief summary of the post"
          />
          {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>}
        </div>
        
        {/* Content */}
        <div className="col-span-2">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={12}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${errors.content ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            placeholder="Write your post content here..."
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
        </div>
        
        {/* Publication Status */}
        <div className="col-span-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_published"
              name="is_published"
              checked={formData.is_published}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Publish immediately
            </label>
          </div>
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : postId ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  );
}
