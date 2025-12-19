"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <rect width="40" height="40" rx="8" fill="currentColor" />
        <path
          d="M20 11C16.13 11 13 14.13 13 18C13 22.5 20 29 20 29C20 29 27 22.5 27 18C27 14.13 23.87 11 20 11ZM20 20.5C18.62 20.5 17.5 19.38 17.5 18C17.5 16.62 18.62 15.5 20 15.5C21.38 15.5 22.5 16.62 22.5 18C22.5 19.38 21.38 20.5 20 20.5Z"
          fill="hsl(var(--primary-foreground))"
        />
      </svg>
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-wider text-foreground">
          DIGI-PINCODE
        </span>
        <span className="text-xs text-muted-foreground -mt-1">
          An elegant way to find any post office across India
        </span>
      </div>
    </div>
  );
};


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
            <Link href="/privacy-policy">Privacy Policy</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </nav>
        <div className="md:hidden flex items-center gap-2">
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
                <Link href="/privacy-policy" className="py-2 hover:text-primary">
                  Privacy Policy
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
