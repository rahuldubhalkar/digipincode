
import { getStates } from '@/lib/data';
import { PostOffice } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getTranslation } from '@/lib/i18n/get-translation';
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
        return [];
    }
}

async function getAllStateData() {
    const states = await getStates();
    const allData = await Promise.all(states.map(async state => {
        const postOffices = await getPostOfficesByState(state);
        return { state, postOffices };
    }));
    return allData;
}

export async function generateStaticParams() {
    const allStateData = await getAllStateData();
    const params: { stateName: string; districtName: string }[] = [];

    allStateData.forEach(({ state, postOffices }) => {
        if (postOffices.length > 0) {
            const districts = [...new Set(postOffices.map(po => po.district))];
            districts.forEach(district => {
                if (district) {
                     params.push({
                        stateName: state.replace(/ /g, '-').toLowerCase(),
                        districtName: district.replace(/ /g, '-').toLowerCase(),
                    });
                }
            });
        }
    });
    return params;
}

export async function generateMetadata({ params }: { params: { stateName: string, districtName: string } }) {
    const stateName = params.stateName.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const districtName = params.districtName.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
        title: `Pincodes in ${districtName}, ${stateName} - India Post Pincode`,
        description: `Find all Post Office PIN codes in ${districtName} district, ${stateName}. Get a complete list of post offices for accurate mail and package delivery.`,
    };
}

export default async function DistrictPage({ params }: { params: { stateName: string, districtName: string } }) {
    const stateNameParam = params.stateName.replace(/-/g, ' ').toUpperCase();
    const districtNameParam = params.districtName.replace(/-/g, ' ').toUpperCase();
    
    const allPostOffices = await getPostOfficesByState(stateNameParam);
    
    if (!allPostOffices.length) {
        notFound();
    }
    
    const districtPostOffices = allPostOffices.filter(po => po.district.toUpperCase() === districtNameParam);

    if (!districtPostOffices.length) {
        notFound();
    }

    const stateName = stateNameParam.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    const districtName = districtNameParam.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

    return (
        <main className="container mx-auto px-4 py-8 space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start flex-wrap gap-4">
                        <div>
                             <CardTitle className="text-3xl">Post Offices in {districtName} District</CardTitle>
                             <CardDescription>
                                A complete list of all post offices and PIN codes in {districtName}, {stateName}.
                            </CardDescription>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href={`/state/${params.stateName}`}>
                                Back to {stateName}
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <PostOfficeTable postOffices={districtPostOffices.sort((a,b) => a.officename.localeCompare(b.officename))} />
                </CardContent>
            </Card>
        </main>
    )
}
