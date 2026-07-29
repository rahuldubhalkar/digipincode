import type { Metadata } from 'next';
import { getStates } from '@/lib/data';
import { PostOffice } from '@/lib/types';
import { promises as fs } from 'fs';
import path from 'path';
import { PostOfficeTable } from '@/components/post-office-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchForm } from '@/components/search-form';

async function getPostOfficesByState(state: string): Promise<PostOffice[]> {
    if (!state) return [];
    try {
        const filePath = path.join(process.cwd(), 'public', 'data', `${state}.json`);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error(`Failed to load data for state: ${state}`, error);
        return [];
    }
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<any> }): Promise<Metadata> {
    const sParams = await searchParams;
    const state = typeof sParams.state === 'string' ? sParams.state : '';
    const district = typeof sParams.district === 'string' ? sParams.district : '';
    const searchTerm = typeof sParams.q === 'string' ? sParams.q : '';
    const letter = typeof sParams.letter === 'string' ? sParams.letter : '';

    let title = 'Pincode Search';
    let location = '';
    if (district) {
        location += `${district.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}, `;
    }
     if (state) {
        location += `${state.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}`;
    }
    if (location) {
        title = `Search results in ${location}`;
    }
    if(searchTerm) {
        title += ` for "${searchTerm}"`;
    }
    if(letter) {
        title += ` starting with "${letter}"`;
    }

    return {
        title,
        description: `Find pincodes and post office details. Search results for state: ${state}, district: ${district}, query: ${searchTerm}, and letter: ${letter}.`,
    };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<any> }) {
    const sParams = await searchParams;
    const state = typeof sParams.state === 'string' ? sParams.state.toUpperCase() : '';
    const district = typeof sParams.district === 'string' ? sParams.district : '';
    const searchTerm = typeof sParams.q === 'string' ? sParams.q : '';
    const letter = typeof sParams.letter === 'string' ? sParams.letter.toUpperCase() : '';

    const allPostOffices = await getPostOfficesByState(state);
    
    const filteredPostOffices = allPostOffices.filter(po => {
        let matches = true;
        if (district) {
            matches = matches && (po.district || "").toUpperCase() === district.toUpperCase();
        }
        if (searchTerm) {
            matches = matches && (po.officename || "").toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (letter) {
            matches = matches && (po.officename || "").toUpperCase().startsWith(letter);
        }
        return matches;
    }).sort((a, b) => (a.officename || "").localeCompare(b.officename || ""));
    
    const states = await getStates();
    
    let location = '';
    const districtName = district ? district.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : '';
    const stateName = state ? state.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : '';

    if (districtName) location += `${districtName}, `;
    if (stateName) location += stateName;

    let description = ``;
    if (searchTerm) description += `Query: "${searchTerm}"`;
    if (letter) {
        if (description) description += `, `;
        description += `Starting with: "${letter}"`;
    }

    return (
        <main className="container mx-auto px-4 py-8 space-y-8">
             <Card className="w-full shadow-lg border-none">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-headline tracking-tight text-primary">Pincode Search</CardTitle>
                    <CardDescription>Use the form below to search for pincodes across India.</CardDescription>
                </CardHeader>
                <CardContent>
                    <SearchForm 
                        states={states}
                        initialState={state}
                        initialDistrict={district}
                        initialSearchTerm={searchTerm}
                        initialLetter={letter}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {filteredPostOffices.length > 0 
                            ? `Search Results in ${location || 'India'}`
                            : `No results found for your search in ${location || 'India'}`
                        }
                    </CardTitle>
                     {description && <CardDescription>{description}</CardDescription>}
                </CardHeader>
                <CardContent>
                    <PostOfficeTable postOffices={filteredPostOffices} searched={true} />
                </CardContent>
            </Card>
        </main>
    );
}
