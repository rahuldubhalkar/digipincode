
"use client";

import { useTranslation } from "@/lib/i18n/use-translation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { placeholderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import { User, Calendar } from "lucide-react";

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

  const imageArticles = [
    {
      title: "Incentive Structure for GDS Postal Staff (BPMs) on POSB Schemes",
      image: placeholderImages.gdsIncentive,
      href: "/articles/gds-incentive-scheme"
    },
    {
      title: "Urgent operationalisation of the 8th Central Pay Commission – Immediate allotment of office space and commencement of work",
      image: placeholderImages.centralPayCommission,
      href: "/articles/central-pay-commission"
    },
    {
      title: "Ensuring Upgradation of DREAM App to Version 1.0.28 on all MDM Controlled Devices",
      image: placeholderImages.dreamAppUpdate,
      href: "/articles/dream-app-update"
    },
    {
      title: "Result of GDSs to Multi-Tasking Staff (MTS) Cadre, held on 31.08.2025 - AP Circle",
      image: placeholderImages.gdsToMtsResult,
      href: "/articles/gds-to-mts-result"
    }
  ]

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
                <div className="flex flex-col gap-8 justify-center items-start pt-6">
                    {imageArticles.map((article, index) => (
                        <Link href={article.href} key={index} className="group cursor-pointer block w-full max-w-md">
                            <div className="flex items-start gap-4">
                                <div className="w-32 flex-shrink-0">
                                    <div className="overflow-hidden rounded-lg border shadow-md aspect-square relative">
                                        <Image
                                            src={article.image.imageUrl}
                                            alt={article.title}
                                            fill
                                            data-ai-hint={article.image.imageHint}
                                            className="object-cover transform transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-lg font-semibold tracking-tight text-primary mb-2">{article.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                        <div className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            <span>Admin</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>Tuesday, December 30, 2025</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground group-hover:text-primary">Click to view details</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
          </CardContent>
      </Card>
    </div>
  );
}
