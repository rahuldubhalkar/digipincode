import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'pincode | Indian Post Pincode',
    template: '%s | digi-pincode',
  },
  description: 'The complete India Post Office PIN code directory. Use our fast and accurate postal code search tool. Search by Pincode, State, or District to get a complete post office list with addresses and details for all India pincodes.',
  manifest: "/manifest.json",
  icons: {
    icon: '/favicon.svg?v=4',
    shortcut: '/favicon.svg?v=4',
    apple: '/favicon.svg?v=4',
  },
  appleWebApp: {
    title: 'digi-pincode',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
