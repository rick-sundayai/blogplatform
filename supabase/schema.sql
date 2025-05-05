-- Create tables for blog platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set up storage for images (optional, but useful for blog platforms)
CREATE EXTENSION IF NOT EXISTS "pg_graphql";

-- Create authors table
CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT NOT NULL,
  bio TEXT NOT NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  author_id UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  read_time TEXT NOT NULL DEFAULT '5 min read'
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Create RLS policies for security

-- Enable Row Level Security
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (read-only)
CREATE POLICY "Allow public read access to authors" 
  ON authors FOR SELECT USING (true);

CREATE POLICY "Allow public read access to categories" 
  ON categories FOR SELECT USING (true);

CREATE POLICY "Allow public read access to published posts" 
  ON posts FOR SELECT USING (is_published = true);

-- Create policies for authenticated users (authors/admins)
-- Note: In a real app, you'd want to check if the user is an admin or the author
-- For now, we'll allow any authenticated user to modify data

CREATE POLICY "Allow authenticated users to create authors" 
  ON authors FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update authors" 
  ON authors FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to create categories" 
  ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update categories" 
  ON categories FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to create posts" 
  ON posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update posts" 
  ON posts FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete posts" 
  ON posts FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Insert sample data

-- Sample authors
INSERT INTO authors (name, email, avatar, bio)
VALUES 
  ('Alex Johnson', 'alex@example.com', 'https://randomuser.me/api/portraits/men/32.jpg', 'Senior developer with a passion for AI and machine learning.'),
  ('Sarah Miller', 'sarah@example.com', 'https://randomuser.me/api/portraits/women/44.jpg', 'Frontend specialist focusing on React and modern JavaScript.'),
  ('Michael Chen', 'michael@example.com', 'https://randomuser.me/api/portraits/men/67.jpg', 'Full-stack developer and open source contributor.'),
  ('Emily Rodriguez', 'emily@example.com', 'https://randomuser.me/api/portraits/women/23.jpg', 'UX designer and accessibility advocate.');

-- Sample categories
INSERT INTO categories (name, slug, description, image)
VALUES
  ('Technology', 'technology', 'Latest news and trends in the tech world', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop'),
  ('Programming', 'programming', 'Tutorials and guides for developers', 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop'),
  ('Design', 'design', 'UI/UX design principles and inspiration', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop'),
  ('AI & Machine Learning', 'ai', 'Exploring artificial intelligence and ML', 'https://images.unsplash.com/photo-1677442135136-760c813029fb?q=80&w=800&auto=format&fit=crop');

-- Sample posts
INSERT INTO posts (title, slug, content, excerpt, cover_image, published_at, is_published, author_id, category_id, read_time)
VALUES
  (
    'The Future of AI in Software Development',
    'future-of-ai-in-software-development',
    E'# The Future of AI in Software Development\n\nArtificial intelligence is revolutionizing how we build and maintain software. From code completion to automated testing, AI tools are becoming essential for modern developers.\n\n## Code Generation\n\nAI-powered code generation tools like GitHub Copilot and Amazon CodeWhisperer are changing how developers write code. These tools can suggest entire functions or blocks of code based on comments or function signatures.\n\n## Automated Testing\n\nAI is also transforming software testing. Machine learning models can generate test cases, identify potential bugs, and even fix simple issues automatically.\n\n## Developer Experience\n\nThe integration of AI into developer workflows is improving productivity and reducing the cognitive load on developers. This allows teams to focus on solving complex problems rather than writing boilerplate code.',
    'Artificial intelligence is revolutionizing how we build and maintain software. From code completion to automated testing, AI tools are becoming essential for modern developers.',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600&auto=format&fit=crop',
    NOW(),
    TRUE,
    (SELECT id FROM authors WHERE name = 'Alex Johnson'),
    (SELECT id FROM categories WHERE slug = 'technology'),
    '8 min read'
  ),
  (
    'Getting Started with Next.js 15',
    'getting-started-with-nextjs-15',
    E'# Getting Started with Next.js 15\n\nNext.js 15 brings significant improvements to the React framework, making it even more powerful for building modern web applications.\n\n## New Features\n\nNext.js 15 introduces several new features that enhance developer experience and application performance:\n\n- Improved App Router\n- Enhanced Server Components\n- Better Image Optimization\n- Turbopack Improvements\n\n## Setting Up Your First Project\n\nCreating a new Next.js 15 project is simple:\n\n```bash\nnpx create-next-app@latest my-app\n```\n\nFollow the prompts to configure your project with TypeScript, ESLint, and other options.',
    'Learn how to build modern web applications with the latest version of Next.js framework.',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    NOW() - INTERVAL '3 days',
    TRUE,
    (SELECT id FROM authors WHERE name = 'Sarah Miller'),
    (SELECT id FROM categories WHERE slug = 'programming'),
    '5 min read'
  ),
  (
    'Mastering TypeScript for React Development',
    'mastering-typescript-for-react-development',
    E'# Mastering TypeScript for React Development\n\nTypeScript has become the standard for building robust React applications. This guide will help you leverage TypeScript effectively in your React projects.\n\n## Type-Safe Props\n\nDefining proper interfaces for your component props is essential:\n\n```typescript\ninterface ButtonProps {\n  text: string;\n  onClick: () => void;\n  variant?: "primary" | "secondary";\n  disabled?: boolean;\n}\n\nconst Button: React.FC<ButtonProps> = ({\n  text,\n  onClick,\n  variant = "primary",\n  disabled = false\n}) => {\n  // Component implementation\n};\n```\n\n## Custom Hooks with TypeScript\n\nTypeScript makes custom hooks more powerful and safer to use:\n\n```typescript\nfunction useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {\n  // Hook implementation\n}\n```',
    'Discover how TypeScript can improve your React applications with static type checking.',
    'https://images.unsplash.com/photo-1552308995-2baac1ad5490?q=80&w=800&auto=format&fit=crop',
    NOW() - INTERVAL '6 days',
    TRUE,
    (SELECT id FROM authors WHERE name = 'Michael Chen'),
    (SELECT id FROM categories WHERE slug = 'programming'),
    '7 min read'
  ),
  (
    'Designing for Dark Mode: Best Practices',
    'designing-for-dark-mode-best-practices',
    E'# Designing for Dark Mode: Best Practices\n\nDark mode has become a standard feature in modern applications. Learn how to implement it effectively in your web projects.\n\n## Color Selection\n\nChoosing the right colors for dark mode is crucial:\n\n- Avoid pure black (#000000) as your background color\n- Use slightly off-white text instead of pure white\n- Maintain sufficient contrast ratios for accessibility\n\n## CSS Implementation\n\nImplementing dark mode with CSS variables:\n\n```css\n:root {\n  --background: #ffffff;\n  --foreground: #171717;\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    --background: #121212;\n    --foreground: #e0e0e0;\n  }\n}\n```\n\n## User Preferences\n\nAlways respect user preferences by checking the `prefers-color-scheme` media query, but also provide a manual toggle for users who want to override their system settings.',
    'Learn how to create beautiful dark mode interfaces that enhance user experience.',
    'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop',
    NOW() - INTERVAL '9 days',
    TRUE,
    (SELECT id FROM authors WHERE name = 'Emily Rodriguez'),
    (SELECT id FROM categories WHERE slug = 'design'),
    '6 min read'
  );
