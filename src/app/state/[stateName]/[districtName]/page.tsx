
import { getStates } from '@/lib/data';
import type { PostOffice } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, MapPin, Hash } from 'lucide-react';
import { promises as fs } from 'fs';
import path from 'path';
import { PostOfficeTable } from '@/components/post-office-table';

async function getPostOfficesByState(state: string): Promise<PostOffice[]> {
    if (!state) return [];
    try {
        const filePath = path.join(process.cwd(), 'public', 'data', `${state.toUpperCase()}.json`);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<{ stateName: string, districtName: string }> }) {
    const { stateName: sNameSlug, districtName: dNameSlug } = await params;
    
    const formatSlug = (slug: string) => slug.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    const stateName = formatSlug(sNameSlug);
    const districtName = formatSlug(dNameSlug);

    return {
        title: `PIN Codes in ${districtName}, ${stateName} | District Directory`,
        description: `Find all 6-digit PIN codes for post offices in ${districtName} district, ${stateName}. View complete details including office type, taluka, and delivery status.`,
    };
}

export default async function DistrictPage({ params }: { params: Promise<{ stateName: string, districtName: string }> }) {
    const { stateName: sNameSlug, districtName: dNameSlug } = await params;
    
    if (!sNameSlug || !dNameSlug) notFound();

    const stateNameParam = sNameSlug.replace(/-/g, ' ').toUpperCase();
    const districtNameParam = dNameSlug.replace(/-/g, ' ').toUpperCase();
    
    const allPostOffices = await getPostOfficesByState(stateNameParam);
    
    if (!allPostOffices || allPostOffices.length === 0) {
        notFound();
    }
    
    const districtPostOffices = allPostOffices.filter(po => 
        po && po.district && po.district.toUpperCase() === districtNameParam
    );

    if (districtPostOffices.length === 0) {
        notFound();
    }

    const formatName = (name: string) => name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    const stateName = formatName(stateNameParam);
    const districtName = formatName(districtNameParam);
    const uniquePincodes = new Set(districtPostOffices.map(po => po.pincode));

    return (
        <main className="container mx-auto px-4 py-8 space-y-8">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                <Link href="/" className="hover:text-primary flex items-center gap-1">
                    <Home className="h-4 w-4" /> Home
                </Link>
                <span>/</span>
                <Link href={`/state/${sNameSlug}`} className="hover:text-primary">
                    {stateName}
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">{districtName}</span>
            </nav>

            <Card className="border-none shadow-lg">
                <CardHeader className="bg-primary/5 rounded-t-lg">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                        <div className="space-y-2">
                             <div className="flex items-center gap-2">
                                <MapPin className="text-primary h-6 w-6" />
                                <CardTitle className="text-3xl md:text-4xl text-primary font-bold">
                                    PIN Codes in {districtName}
                                </CardTitle>
                             </div>
                             <CardDescription className="text-lg">
                                Detailed directory of all {districtPostOffices.length} post offices and {uniquePincodes.size} unique PIN codes in {districtName} district, {stateName}.
                            </CardDescription>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href={`/state/${sNameSlug}`}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                All {stateName} Districts
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-8">
                    <section className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                                            <p className="text-2xl font-bold">{districtPostOffices.length}</p>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Post Offices</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">Post Office & Pincode List</h2>
                            <p className="text-muted-foreground">
                                The following table provides complete details for every post office in {districtName}, including their type, Taluka, and official 6-digit Indian PIN code.
                            </p>
                            <PostOfficeTable postOffices={districtPostOffices.sort((a,b) => (a.officename || "").localeCompare(b.officename || ""))} />
                        </div>
                    </section>
                </CardContent>
            </Card>
        </main>
    )
}
