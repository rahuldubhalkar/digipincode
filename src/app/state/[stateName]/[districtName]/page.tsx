
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
    const p = await params;
    const sNameSlug = p.stateName;
    const dNameSlug = p.districtName;
    
    const formatSlug = (slug: string) => slug.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const stateName = formatSlug(sNameSlug);
    const districtName = formatSlug(dNameSlug);

    return {
        title: `PIN Codes in ${districtName}, ${stateName} | District Directory`,
        description: `Find all 6-digit PIN codes for post offices in ${districtName} district, ${stateName}. View complete details including office type, taluka, and delivery status.`,
    };
}

export default async function DistrictPage({ params }: { params: Promise<{ stateName: string, districtName: string }> }) {
    const p = await params;
    const sNameSlug = p.stateName;
    const dNameSlug = p.districtName;
    
    if (!sNameSlug || !dNameSlug) notFound();

    const states = await getStates();
    const matchedState = states.find(s => s.replace(/ /g, '-').toLowerCase() === sNameSlug);
    if (!matchedState) notFound();

    const allPostOffices = await getPostOfficesByState(matchedState);
    if (!allPostOffices || allPostOffices.length === 0) notFound();
    
    const districtNameSlug = dNameSlug.toLowerCase();
    const districtPostOffices = allPostOffices.filter(po => {
        const d = (po.district || (po as any).District || (po as any).districtname || '').toString();
        return d && d.replace(/ /g, '-').toLowerCase() === districtNameSlug;
    });

    if (districtPostOffices.length === 0) notFound();

    const firstEntry = districtPostOffices[0];
    const actualDistrictName = (firstEntry.district || (firstEntry as any).District || (firstEntry as any).districtname || dNameSlug.replace(/-/g, ' ')).toString().toUpperCase();

    return (
        <main className="container mx-auto px-4 py-8 space-y-8">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                <Link href="/" className="hover:text-primary flex items-center gap-1">
                    <Home className="h-4 w-4" /> Home
                </Link>
                <span>/</span>
                <Link href={`/state/${sNameSlug}`} className="hover:text-primary">
                    {matchedState}
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">{actualDistrictName}</span>
            </nav>

            <Card className="border-none shadow-lg overflow-hidden">
                <CardHeader className="bg-primary/5 border-b">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                        <div className="space-y-2">
                             <div className="flex items-center gap-2">
                                <MapPin className="text-primary h-6 w-6" />
                                <CardTitle className="text-3xl md:text-4xl text-primary font-bold">
                                    PIN Codes in {actualDistrictName}
                                </CardTitle>
                             </div>
                             <CardDescription className="text-lg">
                                Detailed directory of all {districtPostOffices.length} post offices in {actualDistrictName}, {matchedState}.
                            </CardDescription>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href={`/state/${sNameSlug}`}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to {matchedState}
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-8">
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
