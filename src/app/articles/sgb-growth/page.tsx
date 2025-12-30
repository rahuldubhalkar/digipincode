
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { placeholderImages } from "@/lib/placeholder-images";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SgbGrowthPage() {
    const articleImage = placeholderImages.sgbGrowth;
    const title = "Growth of Sovereign Gold Bond (SGB)";

    return (
        <main className="container mx-auto px-4 py-8">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/#articles">
                                <ArrowLeft />
                                <span className="sr-only">Back to articles</span>
                            </Link>
                        </Button>
                        <CardTitle className="text-2xl md:text-3xl">{title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="relative aspect-video w-full overflow-hidden rounded-lg border">
                    <Image
                        src={articleImage.imageUrl}
                        alt={title}
                        fill
                        data-ai-hint={articleImage.imageHint}
                        className="object-contain"
                    />
                </CardContent>
            </Card>
        </main>
    );
}
