
"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/use-translation";
import { useState, useEffect } from "react";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { t } = useTranslation();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);


  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-6 text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <div className="space-y-2">
             <p>&copy; {currentYear} digi-pincode. {t('footer.rights')}</p>
             <p>Find accurate India Post Office details and PIN codes using our fast and easy post office search tool.</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link href="/about" className="hover:text-primary">{t('nav.about')}</Link>
            <Link href="/contact" className="hover:text-primary">{t('nav.contact')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
