
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { placeholderImages } from "@/lib/placeholder-images";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from 'next';

const articleInfo = {
    title: "Result of GDSs to Multi-Tasking Staff (MTS) Cadre, held on 31.08.2025 - AP Circle",
    image: placeholderImages.gdsToMtsResult,
};

export function generateMetadata(): Metadata {
  return {
    title: articleInfo.title,
    description: `Official results for the promotion of Gramin Dak Sevaks (GDS) to the Multi-Tasking Staff (MTS) cadre in the AP Circle, examination held on 31.08.2025.`,
  };
}

export default function GdsToMtsResultPage() {
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
