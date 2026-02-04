
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
        const filePath = path.join(process.cwd(), `public/data/${state}.json`);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error(`Failed to load data for state: ${state}`, error);
        return [];
    }
}

export async function generateMetadata({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }): Promise<Metadata> {
    const state = typeof searchParams.state === 'string' ? searchParams.state : '';
    const searchTerm = typeof searchParams.q === 'string' ? searchParams.q : '';
    const letter = typeof searchParams.letter === 'string' ? searchParams.letter : '';

    let title = 'Pincode Search';
    if (state) {
        title = `Search results in ${state.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}`;
    }
    if(searchTerm) {
        title += ` for "${searchTerm}"`;
    }
    if(letter) {
        title += ` starting with "${letter}"`;
    }

    return {
        title,
        description: `Find pincodes and post office details. Search results for state: ${state}, query: ${searchTerm}, and letter: ${letter}.`,
        robots: {
            index: false, // Don't index search result pages
            follow: false,
        }
    };
}

export default async function SearchPage({ searchParams }: { searchParams: { [key:string]: string | string[] | undefined } }) {
    const state = typeof searchParams.state === 'string' ? searchParams.state.toUpperCase() : '';
    const searchTerm = typeof searchParams.q === 'string' ? searchParams.q : '';
    const letter = typeof searchParams.letter === 'string' ? searchParams.letter.toUpperCase() : '';

    const allPostOffices = await getPostOfficesByState(state);
    
    const filteredPostOffices = allPostOffices.filter(po => {
        let matches = true;
        if (searchTerm) {
            matches = matches && po.officename.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (letter) {
            matches = matches && po.officename.toUpperCase().startsWith(letter);
        }
        return matches;
    }).sort((a, b) => a.officename.localeCompare(b.officename));
    
    const states = await getStates();
    
    const stateName = state.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

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
                        initialSearchTerm={searchTerm}
                        initialLetter={letter}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {filteredPostOffices.length > 0 
                            ? `Search Results in ${stateName}`
                            : `No results found for your search in ${stateName}`
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
