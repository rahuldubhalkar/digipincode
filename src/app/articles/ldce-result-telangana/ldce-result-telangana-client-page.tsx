
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { placeholderImages } from "@/lib/placeholder-images";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const articleInfo = {
    title: "Declaration of Result of Limited Departmental Competitive Examination for promotion to the post of Postal Assistant (CO/RO), Postal Assistant (PO) and Sorting Assistant (RMS) from eligible officials for the vacancy year 2025 (01.01.2025 to 31.12.2025) held on 17.08.2025 (Sunday) and DEST conducted on 27.12.2025 (Saturday) - Telangana Circle",
    image: placeholderImages.ldceResultTelangana,
    pdfLink: "https://utilities.cept.gov.in/dop/pdfbind.ashx?id=14475",
};

export function LdceResultTelanganaClientPage() {
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
                <CardContent className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border">
                    <Image
                        src={articleInfo.image.imageUrl}
                        alt={articleInfo.title}
                        fill
                        data-ai-hint={articleInfo.image.imageHint}
                        className="object-contain"
                    />
                </CardContent>
                <CardFooter className="mt-6 flex justify-center">
                    <Button asChild>
                        <a href={articleInfo.pdfLink} target="_blank" rel="noopener noreferrer">
                            <Download className="mr-2 h-4 w-4" />
                            Download Result PDF
                        </a>
                    </Button>
                </CardFooter>
            </Card>
        </main>
    );
}
