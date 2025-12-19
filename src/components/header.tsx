"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";

const Logo = () => (
  <svg
    width="160"
    height="32"
    viewBox="0 0 160 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-auto text-foreground"
  >
    <title>digi-pincode Logo</title>
    <defs>
      <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <g>
      <rect
        x="1"
        y="4"
        width="24"
        height="24"
        rx="6"
        stroke="url(#logoGradient)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M11 12.6667L14.3333 12.6667L13 16L16.3333 16L13.6667 19.3333L16.3333 19.3333M18.9999 12.6667L15.6666 12.6667L16.9999 16L13.6666 16L16.3333 19.3333"
        stroke="url(#logoGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="34"
        y="21"
        fontFamily="sans-serif"
        fontSize="16"
        fontWeight="bold"
        fill="currentColor"
      >
        digi-pincode
      </text>
    </g>
  </svg>
);


export default function Header() {
  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center space-x-1">
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/pincode">Find by Pincode</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/about">About Us</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </nav>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-4 text-lg font-medium mt-8">
                <Link href="/" className="py-2 hover:text-primary">
                  Home
                </Link>
                <Link href="/pincode" className="py-2 hover:text-primary">
                  Find by Pincode
                </Link>
                <Link href="/about" className="py-2 hover:text-primary">
                  About Us
                </Link>
                <Link href="/contact" className="py-2 hover:text-primary">
                  Contact Us
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
