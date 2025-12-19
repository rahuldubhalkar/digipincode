"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import LanguageSwitcher from "./language-switcher";
import { useTranslation } from "@/lib/i18n/use-translation";

const Logo = () => {
  const { t } = useTranslation();
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
          {t('header.tagline')}
        </span>
      </div>
    </div>
  );
};


export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center space-x-1">
          <Button variant="ghost" asChild>
            <Link href="/">{t('nav.home')}</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/pincode">{t('nav.findByPincode')}</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/location">{t('nav.myLocation')}</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/about">{t('nav.about')}</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/privacy-policy">{t('nav.privacyPolicy')}</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/contact">{t('nav.contact')}</Link>
          </Button>
          <LanguageSwitcher />
        </nav>
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
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
                  {t('nav.home')}
                </Link>
                <Link href="/pincode" className="py-2 hover:text-primary">
                  {t('nav.findByPincode')}
                </Link>
                 <Link href="/location" className="py-2 hover:text-primary">
                  {t('nav.myLocation')}
                </Link>
                <Link href="/about" className="py-2 hover:text-primary">
                  {t('nav.about')}
                </Link>
                <Link href="/privacy-policy" className="py-2 hover:text-primary">
                  {t('nav.privacyPolicy')}
                </Link>
                <Link href="/contact" className="py-2 hover:text-primary">
                  {t('nav.contact')}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
