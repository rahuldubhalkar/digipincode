
import { getStates } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StateDetails } from '@/components/state-details';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, MapPin, ArrowLeft, Building2 } from 'lucide-react';
import { getPostOfficesByState } from '@/lib/districts';
import { PostOfficeTable } from '@/components/post-office-table';

export async function generateStaticParams() {
    const states = await getStates();
    return states.map((state: string) => ({
        stateName: state.replace(/ /g, '-').toLowerCase(),
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ stateName: string }> }) {
    const p = await params;
    const stateNameSlug = p.stateName;
    if (!stateNameSlug) return { title: 'State Pincode Directory' };
    
    const stateName = stateNameSlug.replace(/-/g, ' ').split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
        title: `All PIN Codes in ${stateName} | Post Office Directory`,
        description: `Browse the complete list of post offices and PIN codes in ${stateName}. Find postal details for all districts in ${stateName}.`,
    };
}

export default async function StatePage({ params }: { params: Promise<{ stateName: string }> }) {
    const p = await params;
    const stateNameSlug = p.stateName;
    if (!stateNameSlug) notFound();

    const states = await getStates();
    
    // Find matching state name from the authorized list
    const matchedState = states.find(s => s.replace(/ /g, '-').toLowerCase() === stateNameSlug);
    
    if (!matchedState) {
        notFound();
    }
    
    // Fetch offices directly to ensure we have data
    const offices = await getPostOfficesByState(matchedState);
    
    if (!offices || offices.length === 0) {
        notFound();
    }
    
    // Derive districts from the offices data with robust key matching
    const districts = [...new Set(offices.map(po => {
        // Handle various possible key names for district
        return (po.district || (po as any).District || (po as any).districtname || '').trim();
    }).filter(Boolean))].sort();

    const stateNameDisplay = matchedState.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

    return (
        <main className="container mx-auto px-4 py-8 space-y-8">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                <Link href="/" className="hover:text-primary flex items-center gap-1">
                    <Home className="h-4 w-4" /> Home
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">{stateNameDisplay}</span>
            </nav>

            <Card className="border-none shadow-lg overflow-hidden">
                <CardHeader className="bg-primary/5 border-b">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                        <div className="space-y-2">
                             <CardTitle className="text-3xl md:text-4xl text-primary font-bold">
                                Post Offices & PIN Codes in {stateNameDisplay}
                             </CardTitle>
                             <CardDescription className="text-lg">
                                Complete directory of postal locations across {districts.length} districts in {stateNameDisplay}.
                            </CardDescription>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Search
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-8 space-y-12">
                    {districts.length > 0 ? (
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <MapPin className="text-primary h-6 w-6" />
                                <h2 className="text-2xl font-bold tracking-tight">Browse by District</h2>
                            </div>
                            <StateDetails 
                                selectedState={matchedState}
                                districts={districts}
                                selectedDistrict=""
                                selectedDivision=""
                            />
                        </section>
                    ) : (
                        <div className="bg-muted/30 rounded-lg p-8 text-center text-muted-foreground">
                            <p>We are currently indexing the districts for {stateNameDisplay}. Detailed office data is available below.</p>
                        </div>
                    )}

                    <section className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Building2 className="text-primary h-6 w-6" />
                            <h2 className="text-2xl font-bold tracking-tight">All Post Offices in {stateNameDisplay}</h2>
                        </div>
                        <p className="text-muted-foreground">
                            Below is the complete list of post offices and their respective 6-digit PIN codes for the entire state of {stateNameDisplay}.
                        </p>
                        <PostOfficeTable postOffices={offices} searched={true} />
                    </section>
                </CardContent>
            </Card>
        </main>
    )
}
