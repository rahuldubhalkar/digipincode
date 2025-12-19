"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/use-translation";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} digi-pincode. {t('footer.rights')}</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link href="/about" className="hover:text-primary">{t('nav.about')}</Link>
            <Link href="/contact" className="hover:text-primary">{t('nav.contact')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
