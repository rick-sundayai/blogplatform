"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { AuthorData } from '../../../../lib/supabase/api';

// Define the Author schema using Zod for validation
const authorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  bio: z.string().optional(),
  avatar_url: z.string().optional(),
});

type AuthorFormProps = {
  authorId?: string;
  initialData?: AuthorData;
};

export default function AuthorForm({ authorId, initialData }: AuthorFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<AuthorData>(initialData || {
    name: '',
    slug: '',
    bio: '',
    avatar_url: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>(initialData?.avatar_url || '');
  
  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  
  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
      .trim();
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsSubmitting(true);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);
      
      const imageUrl = publicUrlData.publicUrl;
      
      // Update form data and preview
      setFormData(prev => ({
        ...prev,
        avatar_url: imageUrl
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
      const validatedData = authorSchema.parse(formData);
      setErrors({});
      setIsSubmitting(true);
      
      // Determine if we're creating or updating
      const isEditing = !!authorId;
      
      let result;
      
      if (isEditing) {
        // Update existing author
        result = await supabase
          .from('authors')
          .update(validatedData)
          .eq('id', authorId)
          .select()
          .single();
      } else {
        // Create new author
        result = await supabase
          .from('authors')
          .insert([validatedData])
          .select()
          .single();
      }
      
      if (result.error) throw result.error;
      
      // Redirect to the authors list
      router.push('/admin/authors');
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
      <div className="space-y-6">
        {/* Avatar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Avatar
          </label>
          <div className="flex items-center">
            <div className="mr-4">
              {previewImage ? (
                <div className="relative h-24 w-24 rounded-full overflow-hidden">
                  <Image 
                    src={previewImage} 
                    alt="Avatar preview" 
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <input
                type="file"
                id="avatar_upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="avatar_upload"
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors inline-block text-center"
              >
                Upload Avatar
              </label>
              <input
                type="text"
                id="avatar_url"
                name="avatar_url"
                value={formData.avatar_url || ''}
                onChange={handleChange}
                placeholder="Or enter image URL"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>
        
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleNameChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            placeholder="Author name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        
        {/* Slug */}
        <div>
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
            placeholder="author-slug"
          />
          {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
        </div>
        
        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio || ''}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Author bio (optional)"
          />
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-3 mt-6">
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
          {isSubmitting ? 'Saving...' : authorId ? 'Update Author' : 'Create Author'}
        </button>
      </div>
    </form>
  );
}
