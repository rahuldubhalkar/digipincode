import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'India Post Tracking | Speed Post & Pincode Finder',
    template: '%s | India Post Pincode',
  },
  description: 'Track your India Post, Speed Post, and registered parcels online. Get real-time status updates, delivery history, and find accurate PIN codes for any location in India.',
  keywords: [
    'india post tracking', 'speed post tracking', 'parcel tracking india', 
    'post office tracking', 'track speed post', 'indian post tracker',
    'pincode finder', 'india pincode search', 'postal code india', 
    'find a pin code', 'zip code india', 'pincode', 'pin code', 
    'postal code', 'india pincode', 'post office india', 'pincode search', 
    'find pincode', 'pincode directory', 'post office near me', 
    'all india pincode', 'pincode by state', 'pincode by city', 
    'pincode by post office'
  ],
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
  themeColor: '#356 72% 49%',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'India Post Pincode & Tracking',
    'url': 'https://www.digi-pincode.com',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://www.digi-pincode.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.digi-pincode.com"
    }]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""/>
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-neutral-50" suppressHydrationWarning>
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
