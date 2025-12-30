
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { placeholderImages } from "@/lib/placeholder-images";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from 'next';

const articleInfo = {
    title: "Promotion & Posting of STS officers in JAG of IPoS, Group 'A' and Transfer-Posting in JAG - Directorate Order dtd 29/12/2025",
    image: placeholderImages.iposJagPromotion,
};

export const metadata: Metadata = {
  title: articleInfo.title,
  description: `Directorate order regarding the promotion and posting of STS officers to the JAG of IPoS, Group 'A' and other transfer-postings in the JAG.`,
};

export default function IposJagPromotionPostingPage() {
    return (
        <main className="container mx-auto px-4 py-8">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/#image-articles">
                                <ArrowLeft />
                                <span className="sr-only">Back to articles</span>
                            </Link>
                        </Button>
                        <CardTitle className="text-2xl md:text-3xl">{articleInfo.title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="relative aspect-video w-full overflow-hidden rounded-lg border">
                    <Image
                        src={articleInfo.image.imageUrl}
                        alt={articleInfo.title}
                        fill
                        data-ai-hint={articleInfo.image.imageHint}
                        className="object-contain"
                    />
                </CardContent>
            </Card>
        </main>
    );
}
