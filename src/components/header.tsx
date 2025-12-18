"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Mail } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-card border-b shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          digi-pincode
        </Link>
        <nav className="hidden md:flex items-center space-x-4">
          <Button variant="link" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="link" asChild>
            <Link href="/pincode">Find by Pincode</Link>
          </Button>
          <Button variant="link" asChild>
            <Link href="/about">About Us</Link>
          </Button>
          <Button variant="link" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
