
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'Find Indian Pincode - Fast & Accurate Postal Code Search',
    template: '%s | India Post Pincode',
  },
  description: 'The complete India Post Office PIN code directory. Use our fast and accurate postal code search tool to find any pincode by state, district, or post office name.',
  keywords: ['pincode finder', 'india pincode search', 'postal code india', 'find a pin code', 'zip code india', 'pincode', 'pin code', 'postal code', 'india pincode', 'post office india', 'pincode search', 'find pincode', 'pincode directory', 'post office near me'],
  manifest: "/manifest.json",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  appleWebApp: {
    title: 'India Post Pincode',
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4B0082',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'India Post Pincode',
    'url': 'https://www.digi-pincode.com', // Replace with your actual domain
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://www.digi-pincode.com/search?q={search_term_string}', // Replace with your actual search URL
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""/>
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <Providers>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Toaster />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
