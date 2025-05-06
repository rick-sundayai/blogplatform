import Image from 'next/image';
import { getTeamMembers } from '@/lib/supabase/team';

export default async function AboutPage() {
  // Fetch team members from Supabase
  const teamMembers = await getTeamMembers();
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About Tech Trails & Tales</h1>
        
        <div className="mb-12 bg-indigo-100 dark:bg-indigo-900/30 h-64 md:h-96 rounded-xl overflow-hidden flex items-center justify-center">
          <div className="text-center p-8">
            <Image 
              src="/globe.svg" 
              alt="Tech Trails & Tales" 
              width={120}
              height={120}
              className="mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold">Exploring Technology Together</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Sharing knowledge and insights since 2025</p>
          </div>
        </div>
        
        <div className="prose dark:prose-invert prose-lg max-w-none">
          <h2>Our Story</h2>
          <p>
            Tech Trails & Tales was founded in 2025 with a simple mission: to make technology accessible, 
            understandable, and exciting for everyone. What started as a personal blog has grown into a 
            community-driven platform where tech enthusiasts, developers, and curious minds come together 
            to explore the ever-evolving world of technology.
          </p>
          
          <h2>Our Mission</h2>
          <p>
            We believe that technology should be accessible to everyone. Our mission is to demystify complex 
            technical concepts, share practical knowledge, and inspire the next generation of innovators. 
            Whether you&apos;re a seasoned developer or just starting your tech journey, we&apos;re here to guide you 
            through the trails of technology and share the tales of innovation.
          </p>
          
          <h2>What We Cover</h2>
          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Programming & Development</h3>
              <p>Tutorials, best practices, and insights into various programming languages and frameworks.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Emerging Technologies</h3>
              <p>Explorations of AI, blockchain, IoT, and other cutting-edge technologies shaping our future.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Digital Transformation</h3>
              <p>How businesses and industries are evolving in the digital age and embracing new technologies.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Tech Culture & Ethics</h3>
              <p>Discussions on the impact of technology on society, ethical considerations, and tech culture.</p>
            </div>
          </div>
          
          <h2>Meet the Team</h2>
          <p>
            Our diverse team of writers, developers, and tech enthusiasts brings a wealth of knowledge and 
            perspectives to Tech Trails & Tales. We&apos;re united by our passion for technology and our commitment 
            to sharing valuable insights with our readers.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 my-8">
            {teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <div key={member.id} className="text-center">
                  <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image 
                      src={member.avatar}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-indigo-600 dark:text-indigo-400">{member.bio.split(' ').slice(0, 3).join(' ')}</p>
                </div>
              ))
            ) : (
              // Fallback if no team members are found
              <>
                <div className="text-center">
                  <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Image 
                      src="/file.svg" 
                      alt="Alex Chen" 
                      width={60}
                      height={60}
                    />
                  </div>
                  <h3 className="text-xl font-semibold">Alex Chen</h3>
                  <p className="text-indigo-600 dark:text-indigo-400">Founder & Lead Editor</p>
                </div>
                <div className="text-center">
                  <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Image 
                      src="/window.svg" 
                      alt="Maya Rodriguez" 
                      width={60}
                      height={60}
                    />
                  </div>
                  <h3 className="text-xl font-semibold">Maya Rodriguez</h3>
                  <p className="text-indigo-600 dark:text-indigo-400">Senior Developer & Writer</p>
                </div>
                <div className="text-center">
                  <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Image 
                      src="/next.svg" 
                      alt="Jordan Taylor" 
                      width={60}
                      height={60}
                    />
                  </div>
                  <h3 className="text-xl font-semibold">Jordan Taylor</h3>
                  <p className="text-indigo-600 dark:text-indigo-400">Tech Analyst & Content Creator</p>
                </div>
              </>
            )}
          </div>
          
          <h2>Join Our Community</h2>
          <p>
            Tech Trails & Tales is more than just a blog—it&apos;s a community. We invite you to join us on this 
            exciting journey through the world of technology. Subscribe to our newsletter, follow us on social 
            media, and engage with our content to stay updated on the latest tech trends and insights.
          </p>
          
          <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-lg my-8">
            <h3 className="text-xl font-semibold mb-3">Get in Touch</h3>
            <p className="mb-4">
              Have questions, suggestions, or want to collaborate? We&apos;d love to hear from you! Reach out to us at 
              <a href="mailto:contact@techtails.com" className="text-indigo-600 dark:text-indigo-400 ml-1">contact@techtails.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
