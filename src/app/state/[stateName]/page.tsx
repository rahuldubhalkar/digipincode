
import { getStates } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StateDetails } from '@/components/state-details';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, MapPin, ArrowLeft } from 'lucide-react';
import { getDistrictsByState } from '@/lib/districts';

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

    const stateNameParam = stateNameSlug.replace(/-/g, ' ').toUpperCase();
    const states = await getStates();
    
    // Exact match check
    if (!states.includes(stateNameParam)) {
        // Try finding closest match or redirect
        const found = states.find(s => s.replace(/ /g, '-').toLowerCase() === stateNameSlug);
        if (!found) notFound();
    }
    
    const districts = await getDistrictsByState(stateNameParam);
    const stateNameDisplay = stateNameParam.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

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
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <MapPin className="text-primary h-6 w-6" />
                            <h2 className="text-2xl font-bold tracking-tight">Browse by District</h2>
                        </div>
                        {districts.length > 0 ? (
                             <StateDetails 
                                selectedState={stateNameParam}
                                districts={districts}
                                selectedDistrict=""
                                selectedDivision=""
                            />
                        ) : (
                            <div className="text-center py-12 bg-muted/30 rounded-lg">
                                <p className="text-muted-foreground">District information for {stateNameDisplay} is currently being updated. Please check back shortly.</p>
                            </div>
                        )}
                    </section>
                </CardContent>
            </Card>
        </main>
    )
}
