
import { getStates } from '@/lib/data';
import { PostOffice } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getTranslation } from '@/lib/i18n/get-translation';
import { StateDetails } from '@/components/state-details';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { promises as fs } from 'fs';
import path from 'path';
import { PostOfficeTable } from '@/components/post-office-table';


async function getPostOfficesByState(state: string): Promise<PostOffice[]> {
    try {
        const filePath = path.join(process.cwd(), `public/data/${state}.json`);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error(`Failed to load data for state: ${state}`, error);
        return [];
    }
}

export async function generateStaticParams() {
    const states = await getStates();
    return states.map(state => ({
        stateName: state.replace(/ /g, '-').toLowerCase(),
    }));
}

export async function generateMetadata({ params }: { params: { stateName: string } }) {
    const stateName = params.stateName.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const t = await getTranslation('en');

    return {
        title: `All Pincodes in ${stateName} - India Post Pincode`,
        description: `Find a complete list of all Post Office PIN codes in ${stateName}. Search by district or post office name in our comprehensive Indian postal code directory.`,
    };
}


export default async function StatePage({ params }: { params: { stateName: string } }) {
    const stateNameParam = params.stateName.replace(/-/g, ' ').toUpperCase();
    const states = await getStates();
    
    if (!states.includes(stateNameParam)) {
        notFound();
    }
    
    const postOffices = await getPostOfficesByState(stateNameParam);
    const t = await getTranslation('en');
    const stateName = stateNameParam.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

    return (
        <main className="container mx-auto px-4 py-8 space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start flex-wrap gap-4">
                        <div>
                             <CardTitle className="text-3xl">Post Offices in {stateName}</CardTitle>
                             <CardDescription>
                                A complete list of all post offices and PIN codes in {stateName}.
                            </CardDescription>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                       <StateDetails 
                           selectedState={stateNameParam}
                           allPostOffices={postOffices}
                           selectedDistrict=""
                           selectedDivision=""
                       />
                       <PostOfficeTable postOffices={postOffices.sort((a,b) => a.officename.localeCompare(b.officename))} />
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}
