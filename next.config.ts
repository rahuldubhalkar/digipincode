
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // allowedDevOrigins: ["https://6000-firebase-studio-1765984807570.cluster-sumfw3zmzzhzkx4mpvz3ogth4y.cloudworkstations.dev"],
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'blogger.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
