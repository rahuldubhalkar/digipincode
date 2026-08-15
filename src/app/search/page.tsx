
import type { Metadata } from 'next';
import { getStates } from '@/lib/data';
import type { PostOffice } from '@/lib/types';
import { promises as fs } from 'fs';
import path from 'path';
import { PostOfficeTable } from '@/components/post-office-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchForm } from '@/components/search-form';

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

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
    const sParams = await searchParams;
    const state = typeof sParams.state === 'string' ? sParams.state : '';
    const district = typeof sParams.district === 'string' ? sParams.district : '';
    const searchTerm = typeof sParams.q === 'string' ? sParams.q : '';

    let title = 'Pincode Search';
    let location = '';
    
    if (district) location += `${district}, `;
    if (state) location += state;
    
    if (location) title = `Search results in ${location}`;
    if (searchTerm) title += ` for "${searchTerm}"`;

    return {
        title: `${title} | India Post Directory`,
        description: `Find pincodes and post office details. Search results for ${location || 'India'}.`,
    };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const sParams = await searchParams;
    const state = typeof sParams.state === 'string' ? sParams.state.toUpperCase() : '';
    const district = typeof sParams.district === 'string' ? sParams.district : '';
    const searchTerm = typeof sParams.q === 'string' ? sParams.q : '';

    const allPostOffices = await getPostOfficesByState(state);
    
    const filteredPostOffices = (allPostOffices || []).filter(po => {
        if (!po) return false;
        let matches = true;
        // Deep lookup for district and office name
        const poDistrict = po.district || (po as any).District || (po as any).districtname || "";
        const poOffice = po.officename || (po as any).officename || "";

        if (district) {
            matches = matches && poDistrict.toString().toUpperCase() === district.toUpperCase();
        }
        if (searchTerm) {
            matches = matches && poOffice.toString().toLowerCase().includes(searchTerm.toLowerCase());
        }
        return matches;
    }).sort((a, b) => {
      const aName = a.officename || (a as any).officename || "";
      const bName = b.officename || (b as any).officename || "";
      return aName.localeCompare(bName);
    });
    
    const states = await getStates();

    return (
        <main className="container mx-auto px-4 py-8 space-y-8">
             <Card className="w-full shadow-lg border-none">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-headline tracking-tight text-primary">Pincode Search</CardTitle>
                    <CardDescription>Search for pincodes across India.</CardDescription>
                </CardHeader>
                <CardContent>
                    <SearchForm 
                        states={states}
                        initialState={state}
                        initialDistrict={district}
                        initialSearchTerm={searchTerm}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {filteredPostOffices.length > 0 
                            ? `Search Results (${filteredPostOffices.length})`
                            : `No results found`
                        }
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <PostOfficeTable postOffices={filteredPostOffices} searched={true} />
                </CardContent>
            </Card>
        </main>
    );
}
