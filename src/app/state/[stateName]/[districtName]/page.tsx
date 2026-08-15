
import { getStates } from '@/lib/data';
import type { PostOffice } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, MapPin, Hash } from 'lucide-react';
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
    const matchedState = states.find(s => s.replace(/ /g, '-').toLowerCase() === sNameSlug) || sNameSlug.replace(/-/g, ' ').toUpperCase();
    
    const allPostOffices = await getPostOfficesByState(matchedState);
    
    if (!allPostOffices || allPostOffices.length === 0) {
        notFound();
    }
    
    const districtNameParam = dNameSlug.replace(/-/g, ' ').toUpperCase();
    
    // Filter with case-insensitivity and multiple key checks
    const districtPostOffices = allPostOffices.filter(po => {
        const d = po.district || (po as any).District;
        return d && d.toUpperCase() === districtNameParam;
    });

    if (districtPostOffices.length === 0) {
        // Robust fallback: Find closest district match by slug
        const matched = allPostOffices.find(po => {
            const d = po.district || (po as any).District;
            return d && d.replace(/ /g, '-').toLowerCase() === dNameSlug;
        });
        
        if (matched) {
            const targetDistrict = matched.district || (matched as any).District;
            const redirectedOffices = allPostOffices.filter(po => (po.district || (po as any).District) === targetDistrict);
            return <DistrictView stateName={matchedState} districtName={targetDistrict} offices={redirectedOffices} sSlug={sNameSlug} />;
        }
        notFound();
    }

    return <DistrictView stateName={matchedState} districtName={districtPostOffices[0].district || (districtPostOffices[0] as any).District} offices={districtPostOffices} sSlug={sNameSlug} />;
}

function DistrictView({ stateName, districtName, offices, sSlug }: { stateName: string, districtName: string, offices: PostOffice[], sSlug: string }) {
    const formatName = (name: string) => name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    const displayState = formatName(stateName);
    const displayDistrict = formatName(districtName);
    const uniquePincodes = new Set(offices.map(po => po.pincode));

    return (
        <main className="container mx-auto px-4 py-8 space-y-8">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                <Link href="/" className="hover:text-primary flex items-center gap-1">
                    <Home className="h-4 w-4" /> Home
                </Link>
                <span>/</span>
                <Link href={`/state/${sSlug}`} className="hover:text-primary">
                    {displayState}
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">{displayDistrict}</span>
            </nav>

            <Card className="border-none shadow-lg overflow-hidden">
                <CardHeader className="bg-primary/5 border-b">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                        <div className="space-y-2">
                             <div className="flex items-center gap-2">
                                <MapPin className="text-primary h-6 w-6" />
                                <CardTitle className="text-3xl md:text-4xl text-primary font-bold">
                                    PIN Codes in {displayDistrict}
                                </CardTitle>
                             </div>
                             <CardDescription className="text-lg">
                                Detailed directory of all {offices.length} post offices and {uniquePincodes.size} unique PIN codes in {displayDistrict}, {displayState}.
                            </CardDescription>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href={`/state/${sSlug}`}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                All {displayState} Districts
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <Card className="bg-muted/50 border-none shadow-none">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <Hash className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{uniquePincodes.size}</p>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total PIN Codes</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-muted/50 border-none shadow-none">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{offices.length}</p>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Post Offices</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold tracking-tight">Post Office & Pincode List</h2>
                        <p className="text-muted-foreground">
                            The following directory provides official 6-digit Indian PIN codes and branch details for every location in {displayDistrict}.
                        </p>
                        <PostOfficeTable postOffices={offices.sort((a,b) => (a.officename || "").localeCompare(b.officename || ""))} />
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}
