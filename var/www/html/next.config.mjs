/** @type {import('next').NextConfig} */
const nextConfig = {
  // IMPORTANT: Set output to 'export' for static hosting
  output: 'export',
  assetPrefix: './',
  
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'blogger.googleusercontent.com',
      }
    ],
  },
};

export default nextConfig;
