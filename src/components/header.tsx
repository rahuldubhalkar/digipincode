"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";

const Logo = () => (
  <div className="flex items-center gap-3">
    <svg
      width="40"
      height="40"
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#c0c0c0", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#ffffff", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="pinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#1E90FF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#00CED1", stopOpacity: 1 }} />
        </linearGradient>
        <radialGradient id="globeShine" cx="0.4" cy="0.4" r="0.6">
          <stop offset="0%" style={{ stopColor: "white", stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: "white", stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      {/* Background and Ring */}
      <circle cx="60" cy="60" r="58" fill="#0A192F" />
      <circle
        cx="60"
        cy="60"
        r="54"
        stroke="url(#ringGradient)"
        strokeWidth="5"
        fill="none"
      />

      {/* Main Pin Shape */}
      <path
        d="M60 105 C 35 105, 15 85, 15 60 C 15 35, 35 15, 60 15 C 85 15, 105 35, 105 60 C 105 75, 95 90, 80 100 L 60 115 L 40 100 C 25 90, 15 75, 15 60"
        fill="url(#pinGradient)"
        transform="scale(0.9) translate(6.5, 3)"
      />

      {/* Globe */}
      <circle cx="60" cy="50" r="22" fill="#2E8B57" />
      <path
        d="M50,40 a20,20 0 0,1 15,25 l-5,-5 a15,15 0 0,0 -10,-15 Z M70,60 a20,20 0 0,1 -25,5 l5,-5 a15,15 0 0,0 15,-10 Z"
        fill="#3CB371"
        transform="translate(-2, -2)"
      />
      <circle cx="60" cy="50" r="22" fill="url(#globeShine)" />


      {/* Circuit lines */}
      <path d="M42 35 v-5 h-5" stroke="white" strokeWidth="1.5" fill="none" />
      <path d="M78 35 v-5 h5" stroke="white" strokeWidth="1.5" fill="none" />
      <path d="M30 50 h-5" stroke="white" strokeWidth="1.5" fill="none" />
      <path d="M90 50 h5" stroke="white" strokeWidth="1.5" fill="none" />
      <path d="M35 68 h-5 v5" stroke="white" strokeWidth="1.5" fill="none" />
      <path d="M85 68 h5 v5" stroke="white" strokeWidth="1.5" fill="none" />
      <path d="M45 80 v5 h-5" stroke="white" strokeWidth="1.5" fill="none" />
      <path d="M75 80 v5 h5" stroke="white" strokeWidth="1.5" fill="none" />
      <path d="M60 88 v5" stroke="white" strokeWidth="1.5" fill="none" />

      {/* Circuit dots */}
      <circle cx="42" cy="35" r="3" fill="white" />
      <circle cx="78" cy="35" r="3" fill="white" />
      <circle cx="30" cy="50" r="3" fill="white" />
      <circle cx="90" cy="50" r="3" fill="white" />
      <circle cx="35" cy="68" r="3" fill="white" />
      <circle cx="85" cy="68" r="3" fill="white" />
      <circle cx="45" cy="80" r="3" fill="white" />
      <circle cx="75" cy="80" r="3" fill="white" />
      <circle cx="60" cy="88" r="3" fill="white" />
    </svg>
    <div className="flex flex-col">
       <span className="text-xl font-bold tracking-wider text-foreground">DIGI-PINCODE</span>
       <span className="text-xs text-red-500 -mt-1">An elegant way to find any post office across India</span>
    </div>
  </div>
);


export default function Header() {
  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
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
