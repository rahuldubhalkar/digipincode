
"use client";

import { useTranslation } from "@/lib/i18n/use-translation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { placeholderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";

export default function Articles() {
  const { t } = useTranslation();

  const textArticles = [
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

  const imageArticle = {
      title: "Incentive Structure for GDS Postal Staff (BPMs) on POSB Schemes",
      image: placeholderImages.gdsIncentive,
      href: "/articles/gds-incentive-scheme"
  }

  return (
    <div className="space-y-8" id="articles">
      <Card className="w-full shadow-lg border-none">
          <CardHeader>
              <CardTitle className="text-2xl font-headline tracking-tight text-center">
                  Informative Articles & Updates
              </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    {textArticles.map((article, index) => (
                        <div key={index}>
                        <h3 className="text-xl font-semibold tracking-tight text-primary mb-2">{article.title}</h3>
                        <p className="prose max-w-none text-muted-foreground text-justify text-sm">
                            {article.content}
                        </p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center">
                    <Link href={imageArticle.href} className="group cursor-pointer block max-w-md">
                        <h3 className="text-xl font-semibold tracking-tight text-primary mb-2 text-center">{imageArticle.title}</h3>
                        <div className="overflow-hidden rounded-lg border shadow-md aspect-[4/3] relative">
                        <Image
                            src={imageArticle.image.imageUrl}
                            alt={imageArticle.title}
                            fill
                            data-ai-hint={imageArticle.image.imageHint}
                            className="object-cover transform transition-transform duration-300 group-hover:scale-105"
                        />
                        </div>
                        <p className="text-center mt-2 text-sm text-muted-foreground group-hover:text-primary">Click to view details</p>
                    </Link>
                </div>
            </div>
          </CardContent>
      </Card>
    </div>
  );
}
