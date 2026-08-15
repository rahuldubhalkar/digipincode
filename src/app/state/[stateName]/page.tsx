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
        description: `Browse the complete list of post offices and PIN codes in ${stateName}. Find postal details for all districts in ${stateName} with our all India pincode search.`,
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
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6 bg-slate-100 p-4 rounded-2xl inline-flex shadow-sm">
                <Link href="/" className="hover:text-primary flex items-center gap-1 font-black">
                    <Home className="h-4 w-4" /> Home
                </Link>
                <span>/</span>
                <span className="text-slate-900 font-black uppercase tracking-widest">{stateNameDisplay}</span>
            </nav>

            <Card className="border-none shadow-2xl overflow-hidden rounded-3xl bg-white">
                <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/[0.02] to-transparent border-b py-12 px-10">
                    <div className="flex justify-between items-start flex-wrap gap-8">
                        <div className="space-y-4">
                             <CardTitle className="text-4xl md:text-5xl text-slate-900 font-black tracking-tight">
                                {stateNameDisplay} <span className="text-primary">Postal Directory</span>
                             </CardTitle>
                             <CardDescription className="text-xl font-medium text-slate-600 max-w-3xl leading-relaxed">
                                Complete directory of postal locations across <span className="text-secondary font-black">{districts.length}</span> districts in <span className="font-bold">{stateNameDisplay}</span>. Browse all <span className="text-secondary font-black">{offices.length}</span> post offices.
                            </CardDescription>
                        </div>
                        <Button variant="outline" asChild className="rounded-2xl border-2 h-14 px-8 text-lg font-black hover:bg-primary hover:text-white transition-all shadow-md">
                            <Link href="/">
                                <ArrowLeft className="mr-3 h-5 w-5" />
                                Back to Search
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-12 px-10 space-y-20">
                    {districts.length > 0 ? (
                        <section className="bg-slate-50 p-10 rounded-[2rem] border border-slate-100 shadow-inner">
                            <div className="flex items-center gap-4 mb-10">
                                <MapPin className="text-primary h-8 w-8" />
                                <h2 className="text-3xl font-black tracking-tight text-slate-900">Browse by District</h2>
                            </div>
                            <StateDetails 
                                selectedState={matchedState}
                                districts={districts}
                                selectedDistrict=""
                                selectedDivision=""
                            />
                        </section>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                           <p className="text-xl font-black text-slate-500">District information for {stateNameDisplay} is being synchronized. Please refresh in a moment.</p>
                        </div>
                    )}

                    <section className="space-y-10">
                        <div className="flex items-center gap-4 border-l-[12px] border-l-primary pl-6">
                            <Building2 className="text-primary h-10 w-10" />
                            <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase tracking-widest">Full Post Office List</h2>
                        </div>
                        <PostOfficeTable postOffices={offices} searched={true} />
                    </section>
                </CardContent>
            </Card>
        </main>
    );
}
