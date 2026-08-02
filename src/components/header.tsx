
"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, Home, Search, MapPin, Info, ShieldCheck, Mail } from "lucide-react";
import LanguageSwitcher from "./language-switcher";
import { useTranslation } from "@/lib/i18n/use-translation";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary p-2 rounded-lg shadow-sm">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary-foreground"
        >
          <path
            d="M12 2C8.13 2 5 5.13 5 9C5 13.5 12 21 12 21C12 21 19 13.5 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold leading-tight tracking-tight text-foreground">
          India Post Pincode
        </span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
          Search Directory
        </span>
      </div>
    </div>
  );
};

export default function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: t('nav.home'), icon: Home },
    { href: "/location", label: t('nav.myLocation'), icon: MapPin },
    { href: "/about", label: t('nav.about'), icon: Info },
    { href: "/privacy-policy", label: t('nav.privacyPolicy'), icon: ShieldCheck },
    { href: "/contact", label: t('nav.contact'), icon: Mail },
  ];

  return (
    <header className="bg-card/80 backdrop-blur-md border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="transition-opacity hover:opacity-90">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={cn(
                "px-3 text-sm font-medium transition-colors",
                pathname === item.href ? "text-primary bg-primary/5 hover:bg-primary/10" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Link href={item.href}>
                {item.label}
              </Link>
            </Button>
          ))}
          <div className="ml-2 pl-2 border-l border-border h-6 flex items-center">
            <LanguageSwitcher />
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center gap-3">
          <LanguageSwitcher />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <SheetHeader className="text-left border-b pb-4 mb-4">
                <SheetTitle>
                   <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all active:scale-[0.98]",
                        pathname === item.href 
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-auto pt-8 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  © {new Date().getFullYear()} India Post Pincode Directory
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
