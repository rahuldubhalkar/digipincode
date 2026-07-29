
import { getStates } from '@/lib/data';
import { PostOffice } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, MapPin } from 'lucide-react';
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
        title: `PIN Codes in ${districtName}, ${stateName} | Post Office Directory`,
        description: `Find all 6-digit PIN codes for post offices in ${districtName} district, ${stateName}. View complete details including office type, taluka, and delivery status for mail delivery.`,
    };
}

export default async function DistrictPage({ params }: { params: { stateName: string, districtName: string } }) {
    const stateNameParam = params.stateName.replace(/-/g, ' ').toUpperCase();
    const districtNameParam = params.districtName.replace(/-/g, ' ').toUpperCase();
    
    const allPostOffices = await getPostOfficesByState(stateNameParam);
    
    if (!allPostOffices.length) {
        notFound();
    }
    
    const districtPostOffices = allPostOffices.filter(po => po.district && po.district.toUpperCase() === districtNameParam);

    if (!districtPostOffices.length) {
        notFound();
    }

    const stateName = stateNameParam.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    const districtName = districtNameParam.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

    return (
        <main className="container mx-auto px-4 py-8 space-y-8">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                <Link href="/" className="hover:text-primary flex items-center gap-1">
                    <Home className="h-4 w-4" /> Home
                </Link>
                <span>/</span>
                <Link href={`/state/${params.stateName}`} className="hover:text-primary">
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
                                    Post Offices in {districtName}
                                </CardTitle>
                             </div>
                             <CardDescription className="text-lg">
                                Complete Pincode list and postal details for {districtName} district, {stateName}.
                            </CardDescription>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href={`/state/${params.stateName}`}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to {stateName}
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-8">
                    <section className="space-y-4">
                        <p className="text-muted-foreground">
                            Explore the comprehensive directory of post offices located in {districtName}. Each entry includes the official PIN code, office type (Head Office, Sub Office, or Branch Office), and delivery status.
                        </p>
                        <PostOfficeTable postOffices={districtPostOffices.sort((a,b) => a.officename.localeCompare(b.officename))} />
                    </section>
                </CardContent>
            </Card>
        </main>
    )
}
