
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { placeholderImages } from "@/lib/placeholder-images";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const articleInfo = {
    title: "Incentive Structure for GDS Postal Staff (BPMs) on POSB Schemes",
    image: placeholderImages.gdsIncentive,
};

const posbSchemes = [
    { scheme: "SB Net Accretion", description: "Excluding deposits made in March but including withdrawals of March of not less than Rs. 500/-", incentive: "1%" },
    { scheme: "1 Yr TD", description: "Deposit", incentive: "0.5%" },
    { scheme: "2 Yr / 3 Yr TD", description: "Deposit", incentive: "1.0%" },
    { scheme: "5 Yr TD", description: "Deposit", incentive: "2.0%" },
    { scheme: "MIS / NSC / KVP", description: "", incentive: "0.5%" },
];

const pmSchemes = [
    { scheme: "PMSBY", details: "Per successful registration", incentive: "₹0.50" },
    { scheme: "PMJJBY", details: "Per successful registration", incentive: "₹20" },
    { scheme: "APY", details: "Per successful registration", incentive: "₹30" },
];


export function GdsIncentiveSchemeClientPage() {

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
                <CardContent className="space-y-8">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                        <Image
                            src={articleInfo.image.imageUrl}
                            alt={articleInfo.title}
                            fill
                            data-ai-hint={articleInfo.image.imageHint}
                            className="object-contain"
                        />
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>POSB SCHEMES</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Scheme</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="text-right">Incentive</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {posbSchemes.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{item.scheme}</TableCell>
                                                <TableCell>{item.description}</TableCell>
                                                <TableCell className="text-right">{item.incentive}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>PM SCHEMES</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Scheme</TableHead>
                                            <TableHead>Details</TableHead>
                                            <TableHead className="text-right">Incentive</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pmSchemes.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{item.scheme}</TableCell>
                                                <TableCell>{item.details}</TableCell>
                                                <TableCell className="text-right">{item.incentive}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
