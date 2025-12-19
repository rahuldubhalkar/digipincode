"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/use-translation";

export default function AboutPage() {
  const { t } = useTranslation();
  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">{t('about.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            {t('about.p1')}
          </p>
          <p>
            {t('about.p2')}
          </p>
          <p>
            {t('about.p3')}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
