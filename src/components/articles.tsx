
"use client";

import { useTranslation } from "@/lib/i18n/use-translation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function Articles() {
  const { t } = useTranslation();

  const articles = [
    {
      title: t('articles.article1.title'),
      content: t('articles.article1.content'),
    },
    {
      title: t('articles.article2.title'),
      content: t('articles.article2.content'),
    },
    {
      title: t('articles.article3.title'),
      content: t('articles.article3.content'),
    },
  ];

  return (
    <div className="space-y-8">
      {articles.map((article, index) => (
        <Card key={index} className="w-full shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-2xl font-headline tracking-tight text-center">
              {article.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none text-muted-foreground text-justify">
            <p>{article.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
