
import { getStates } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StateDetails } from '@/components/state-details';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, MapPin, ArrowLeft, Building2 } from 'lucide-react';
import { getPostOfficesByState } from '@/lib/districts';
import { PostOfficeTable } from '@/components/post-office-table';
import type { PostOffice } from '@/lib/types';

export async function generateStaticParams() {
    const states = await getStates();
    return states.map((state: string) => ({
        stateName: state.replace(/ /g, '-').toLowerCase(),
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ stateName: string }> }) {
    const { stateName: stateNameSlug } = await params;
    if (!stateNameSlug) return { title: 'State Pincode Directory' };
    
    const stateName = stateNameSlug.replace(/-/g, ' ').split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
        title: `All PIN Codes in ${stateName} | India Post Directory`,
        description: `Browse the complete list of post offices and PIN codes in ${stateName}. Find postal details for all districts in ${stateName}.`,
    };
}

export default async function StatePage({ params }: { params: Promise<{ stateName: string }> }) {
    const { stateName: stateNameSlug } = await params;
    if (!stateNameSlug) notFound();

    const states = await getStates();
    const matchedState = states.find(s => s.replace(/ /g, '-').toLowerCase() === stateNameSlug);
    
    if (!matchedState) notFound();
    
    const offices = await getPostOfficesByState(matchedState);
    if (!offices || offices.length === 0) notFound();
    
    // Robust district extraction handling multiple source key formats
    const districts = [...new Set(offices.map(po => {
        const d = (po as any).district || (po as any).District || (po as any).districtname || (po as any).Districtname || '';
        return d.toString().trim();
    }).filter(Boolean))].sort();

    const stateNameDisplay = matchedState.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

    return (
        <main className="container mx-auto px-4 py-12 space-y-10">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6 bg-muted/30 p-3 rounded-lg inline-flex">
                <Link href="/" className="hover:text-primary flex items-center gap-1 font-bold">
                    <Home className="h-4 w-4" /> Home
                </Link>
                <span>/</span>
                <span className="text-foreground font-black uppercase tracking-wide">{stateNameDisplay}</span>
            </nav>

            <Card className="border-none shadow-2xl overflow-hidden ring-1 ring-black/5">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b py-10 px-8">
                    <div className="flex justify-between items-start flex-wrap gap-6">
                        <div className="space-y-3">
                             <CardTitle className="text-4xl md:text-5xl text-primary font-black tracking-tight">
                                {stateNameDisplay} Postal Directory
                             </CardTitle>
                             <CardDescription className="text-xl font-medium text-muted-foreground max-w-2xl">
                                Access PIN codes and location details for all <span className="text-secondary font-black">{offices.length}</span> post offices across <span className="text-secondary font-black">{districts.length}</span> districts.
                            </CardDescription>
                        </div>
                        <Button variant="outline" asChild className="rounded-xl border-2 hover:bg-primary hover:text-white transition-colors">
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Search
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-12 px-8 space-y-16">
                    {districts.length > 0 ? (
                        <section className="bg-muted/20 p-8 rounded-3xl">
                            <div className="flex items-center gap-3 mb-8">
                                <MapPin className="text-primary h-7 w-7" />
                                <h2 className="text-3xl font-black tracking-tight text-secondary">Browse by District</h2>
                            </div>
                            <StateDetails 
                                selectedState={matchedState}
                                districts={districts}
                                selectedDistrict=""
                                selectedDivision=""
                            />
                        </section>
                    ) : (
                        <div className="text-center py-12 bg-muted/30 rounded-lg">
                           <p className="text-lg font-bold text-muted-foreground">District information for {stateNameDisplay} is currently being updated. Please check back shortly.</p>
                        </div>
                    )}

                    <section className="space-y-8">
                        <div className="flex items-center gap-3 border-l-8 border-l-primary pl-4">
                            <Building2 className="text-primary h-8 w-8" />
                            <h2 className="text-3xl font-black tracking-tight text-secondary">Complete Office Directory</h2>
                        </div>
                        <PostOfficeTable postOffices={offices} searched={true} />
                    </section>
                </CardContent>
            </Card>
        </main>
    );
}
