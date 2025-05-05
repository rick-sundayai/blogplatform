/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'randomuser.me',
      'via.placeholder.com',
      'picsum.photos'
    ],
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
};

module.exports = nextConfig;
