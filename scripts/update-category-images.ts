import { createClient } from '@supabase/supabase-js';
import { Database } from '../lib/supabase/database.types';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// New valid image URLs from Unsplash
const validImageUrls = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',  // Tech
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',  // AI
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',  // Science
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',  // Cybersecurity
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',  // Data Science
];

async function updateCategoryImages() {
  try {
    // Get all categories
    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, name, slug, image');

    if (error) {
      throw error;
    }

    if (!categories || categories.length === 0) {
      console.log('No categories found');
      return;
    }

    console.log(`Found ${categories.length} categories`);

    // Update each category with a valid image URL
    for (const category of categories) {
      // Check if the image URL is the broken one
      if (category.image.includes('photo-1677442135136-760c813029fb')) {
        // Select a random image URL from the valid ones
        const randomIndex = Math.floor(Math.random() * validImageUrls.length);
        const newImageUrl = validImageUrls[randomIndex];

        // Update the category image
        const { error: updateError } = await supabase
          .from('categories')
          .update({ image: newImageUrl })
          .eq('id', category.id);

        if (updateError) {
          console.error(`Error updating category ${category.name}:`, updateError);
        } else {
          console.log(`Updated image for category ${category.name} (${category.slug})`);
        }
      } else {
        console.log(`Category ${category.name} already has a valid image URL`);
      }
    }

    console.log('Category image update completed');
  } catch (error) {
    console.error('Error updating category images:', error);
  }
}

// Run the update function
updateCategoryImages();
