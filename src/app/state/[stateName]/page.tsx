
import { getStates } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StateDetails } from '@/components/state-details';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, MapPin, List } from 'lucide-react';
import { getDistrictsByState } from '@/lib/districts';
import { promises as fs } from 'fs';
import path from 'path';
import { PostOfficeTable } from '@/components/post-office-table';
import type { PostOffice } from '@/lib/types';

async function getPostOfficesByState(state: string): Promise<PostOffice[]> {
    if (!state) return [];
    try {
        const filePath = path.join(process.cwd(), 'public', 'data', `${state.toUpperCase()}.json`);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error(`Failed to load data for state: ${state}`, error);
        return [];
    }
}

export async function generateStaticParams() {
    const states = await getStates();
    return states.map((state: string) => ({
        stateName: state.replace(/ /g, '-').toLowerCase(),
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ stateName: string }> }) {
    const resolvedParams = await params;
    const stateNameSlug = resolvedParams?.stateName || '';
    if (!stateNameSlug) return { title: 'State Pincode Directory' };
    
    const stateName = stateNameSlug.replace(/-/g, ' ').split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
        title: `All PIN Codes in ${stateName} | Post Office Directory`,
        description: `Browse the complete list of post offices and PIN codes in ${stateName}. Find postal details for all districts in ${stateName} including office type, taluka, and delivery status.`,
    };
}

export default async function StatePage({ params }: { params: Promise<{ stateName: string }> }) {
    const resolvedParams = await params;
    const stateNameSlug = resolvedParams?.stateName || '';
    if (!stateNameSlug) notFound();

    const stateNameParam = stateNameSlug.replace(/-/g, ' ').toUpperCase();
    const states = await getStates();
    
    if (!states.includes(stateNameParam)) {
        notFound();
    }
    
    const [districts, allPostOffices] = await Promise.all([
        getDistrictsByState(stateNameParam),
        getPostOfficesByState(stateNameParam)
    ]);
    
    // Fallback if districts list is empty but we have post offices
    const effectiveDistricts = districts.length > 0 
        ? districts 
        : [...new Set(allPostOffices.map(po => po?.district).filter(Boolean))].sort();

    const stateName = stateNameParam.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

    return (
        <main className="container mx-auto px-4 py-8 space-y-8">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                <Link href="/" className="hover:text-primary flex items-center gap-1">
                    <Home className="h-4 w-4" /> Home
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">{stateName}</span>
            </nav>

            <Card className="border-none shadow-lg">
                <CardHeader className="bg-primary/5 rounded-t-lg">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                        <div className="space-y-2">
                             <CardTitle className="text-3xl md:text-4xl text-primary font-bold">
                                Post Offices & PIN Codes in {stateName}
                             </CardTitle>
                             <CardDescription className="text-lg">
                                Complete directory of {allPostOffices.length} postal locations and unique PIN codes across {effectiveDistricts.length} districts in {stateName}.
                            </CardDescription>
                        </div>
                        <Button variant="outline" asChild suppressHydrationWarning>
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Home
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-8 space-y-12">
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <MapPin className="text-primary h-6 w-6" />
                            <h2 className="text-2xl font-bold tracking-tight">Browse by District</h2>
                        </div>
                        <StateDetails 
                            selectedState={stateNameParam}
                            districts={effectiveDistricts}
                            selectedDistrict=""
                            selectedDivision=""
                        />
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <List className="text-primary h-6 w-6" />
                            <h2 className="text-2xl font-bold tracking-tight">All Post Offices in {stateName}</h2>
                        </div>
                        <PostOfficeTable 
                            postOffices={allPostOffices.sort((a,b) => (a?.officename || "").localeCompare(b?.officename || ""))} 
                        />
                    </section>
                </CardContent>
            </Card>
        </main>
    )
}
