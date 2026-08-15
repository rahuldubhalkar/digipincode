
import { getStates } from '@/lib/data';
import type { PostOffice } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, MapPin } from 'lucide-react';
import { getPostOfficesByState } from '@/lib/districts';
import { PostOfficeTable } from '@/components/post-office-table';

export async function generateMetadata({ params }: { params: Promise<{ stateName: string, districtName: string }> }) {
    const { stateName: sNameSlug, districtName: dNameSlug } = await params;
    
    const formatSlug = (slug: string) => slug.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const stateName = formatSlug(sNameSlug);
    const districtName = formatSlug(dNameSlug);

    return {
        title: `PIN Codes in ${districtName}, ${stateName} | India Post Directory`,
        description: `Find all 6-digit PIN codes and post office details in ${districtName} district, ${stateName}. Full directory of postal codes and sorting districts.`,
    };
}

export default async function DistrictPage({ params }: { params: Promise<{ stateName: string, districtName: string }> }) {
    const { stateName: sNameSlug, districtName: dNameSlug } = await params;
    
    if (!sNameSlug || !dNameSlug) notFound();

    const states = await getStates();
    const matchedState = states.find(s => s.replace(/ /g, '-').toLowerCase() === sNameSlug);
    if (!matchedState) notFound();

    const allPostOffices = await getPostOfficesByState(matchedState);
    if (!allPostOffices || allPostOffices.length === 0) notFound();
    
    const districtNameSlug = dNameSlug.toLowerCase();
    const districtPostOffices = allPostOffices.filter(po => {
        // Handle multiple source key formats for District
        const d = ((po as any).district || (po as any).District || (po as any).districtname || (po as any).Districtname || '').toString();
        return d && d.replace(/ /g, '-').toLowerCase() === districtNameSlug;
    });

    if (districtPostOffices.length === 0) notFound();

    const firstEntry = districtPostOffices[0];
    const actualDistrictName = ((firstEntry as any).district || (firstEntry as any).District || (firstEntry as any).districtname || (firstEntry as any).Districtname || dNameSlug.replace(/-/g, ' ')).toString().toUpperCase();

    return (
        <main className="container mx-auto px-4 py-12 space-y-10">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6 bg-muted/30 p-3 rounded-lg inline-flex">
                <Link href="/" className="hover:text-primary flex items-center gap-1 font-bold">
                    <Home className="h-4 w-4" /> Home
                </Link>
                <span>/</span>
                <Link href={`/state/${sNameSlug}`} className="hover:text-primary font-bold">
                    {matchedState}
                </Link>
                <span>/</span>
                <span className="text-foreground font-black uppercase tracking-wide">{actualDistrictName}</span>
            </nav>

            <Card className="border-none shadow-2xl overflow-hidden ring-1 ring-black/5">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b py-10 px-8">
                    <div className="flex justify-between items-start flex-wrap gap-6">
                        <div className="space-y-3">
                             <div className="flex items-center gap-3">
                                <MapPin className="text-primary h-8 w-8" />
                                <CardTitle className="text-4xl md:text-5xl text-primary font-black tracking-tight">
                                    {actualDistrictName} Districts
                                </CardTitle>
                             </div>
                             <CardDescription className="text-xl font-medium text-muted-foreground">
                                Detailed directory of <span className="text-secondary font-black">{districtPostOffices.length}</span> post offices in <span className="font-bold">{actualDistrictName}</span>, {matchedState}.
                            </CardDescription>
                        </div>
                        <Button variant="outline" asChild className="rounded-xl border-2 hover:bg-primary hover:text-white transition-colors">
                            <Link href={`/state/${sNameSlug}`}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to {matchedState}
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-12 px-8">
                    <PostOfficeTable postOffices={districtPostOffices.sort((a,b) => {
                      const aName = a.officename || (a as any).officename || "";
                      const bName = b.officename || (b as any).officename || "";
                      return aName.localeCompare(bName);
                    })} />
                </CardContent>
            </Card>
        </main>
    );
}
