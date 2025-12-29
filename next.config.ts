import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
 // IMPORTANT: Set output to 'export' for static hosting
 output: 'export',

 // You can keep these if you really want, but they may hide real errors:
 typescript: {
 ignoreBuildErrors: true,
 },
 eslint: {
 ignoreDuringBuilds: true,
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
 ],
 },
};

export default nextConfig;
