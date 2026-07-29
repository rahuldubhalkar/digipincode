
import { getStates } from '@/lib/data';
import { PostOffice } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StateDetails } from '@/components/state-details';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, MapPin, List } from 'lucide-react';
import { promises as fs } from 'fs';
import path from 'path';
import { PostOfficeTable } from '@/components/post-office-table';

async function getPostOfficesByState(state: string): Promise<PostOffice[]> {
    try {
        const filePath = path.join(process.cwd(), `public/data/${state}.json`);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

export async function generateStaticParams() {
    const states = await getStates();
    return states.map((state: string) => ({
        stateName: state.replace(/ /g, '-').toLowerCase(),
    }));
}

export async function generateMetadata({ params }: any) {
    const stateName = params.stateName.replace(/-/g, ' ').split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
        title: `All PIN Codes in ${stateName} | Post Office Directory`,
        description: `Browse the complete list of post offices and PIN codes in ${stateName}. Find postal details for all districts in ${stateName} including office type, taluka, and delivery status.`,
    };
}

export default async function StatePage({ params }: any) {
    const stateNameParam = params.stateName.replace(/-/g, ' ').toUpperCase();
    const states = await getStates();
    
    if (!states.includes(stateNameParam)) {
        notFound();
    }
    
    const postOffices = await getPostOfficesByState(stateNameParam);
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
                                Complete directory of postal locations and 6-digit PIN codes across all districts in {stateName}.
                            </CardDescription>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Home
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-8">
                    <div className="space-y-12">
                       <section>
                            <div className="flex items-center gap-2 mb-6">
                                <MapPin className="text-primary h-6 w-6" />
                                <h2 className="text-2xl font-bold tracking-tight">Browse by District</h2>
                            </div>
                            <StateDetails 
                                selectedState={stateNameParam}
                                allPostOffices={postOffices}
                                selectedDistrict=""
                                selectedDivision=""
                            />
                       </section>

                       <section className="space-y-6">
                            <div className="flex items-center gap-2">
                                <List className="text-primary h-6 w-6" />
                                <h2 className="text-2xl font-bold tracking-tight">Post Office Directory: {stateName}</h2>
                            </div>
                            <p className="text-muted-foreground">
                                Detailed information for all {postOffices.length} post offices registered in the {stateName} circle. Use the district links above to filter the list.
                            </p>
                            <PostOfficeTable postOffices={postOffices.sort((a,b) => a.officename.localeCompare(b.officename))} />
                       </section>
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}
