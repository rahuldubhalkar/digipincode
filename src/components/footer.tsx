"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} digi-pincode. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link href="/about" className="hover:text-primary">About Us</Link>
            <Link href="/contact" className="hover:text-primary">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
