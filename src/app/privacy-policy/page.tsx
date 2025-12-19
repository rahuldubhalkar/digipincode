"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/use-translation";

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">{t('privacy.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            {t('privacy.p1')}
          </p>

          <h3 className="font-semibold text-lg text-card-foreground pt-4">{t('privacy.h1')}</h3>
          <p>
            {t('privacy.p2')}
          </p>

          <h3 className="font-semibold text-lg text-card-foreground pt-4">{t('privacy.h2')}</h3>
          <p>
            {t('privacy.p3')}
          </p>

          <h3 className="font-semibold text-lg text-card-foreground pt-4">{t('privacy.h3')}</h3>
          <p>
            {t('privacy.p4')}
          </p>
          
          <h3 className="font-semibold text-lg text-card-foreground pt-4">{t('privacy.h4')}</h3>
          <p>
            {t('privacy.p5')}
          </p>

          <h3 className="font-semibold text-lg text-card-foreground pt-4">{t('privacy.h5')}</h3>
          <p>
            {t('privacy.p6')}
          </p>

          <h3 className="font-semibold text-lg text-card-foreground pt-4">{t('privacy.h6')}</h3>
          <p>
            {t('privacy.p7')}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}