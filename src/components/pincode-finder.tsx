"use client";

import { useState, useEffect, useTransition } from 'react';
import type { PostOffice } from '@/lib/types';
import { getDivisions, findPostOffices } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, X } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

function FaqSection() {
    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-center">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
                <AccordionItem value="item-1">
                    <AccordionTrigger>What is a PIN Code?</AccordionTrigger>
                    <AccordionContent>
                        A Postal Index Number (PIN) or PIN Code is a 6-digit code used by India Post for sorting mail. Each digit has a specific geographical meaning, helping to route mail efficiently across the country.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>What is DIGIPIN?</AccordionTrigger>
                    <AccordionContent>
                        DIGIPIN is a modern digital addressing system. It provides a unique, short, and easy-to-share code for any precise location, making it simpler to communicate addresses than with traditional, often complex, street names and building numbers.
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-3">
                    <AccordionTrigger>How is this website useful?</AccordionTrigger>
                    <AccordionContent>
                        Our website allows you to easily find information about any post office in India. You can search by state, division, or even by the name of the post office branch. It's a quick and convenient tool for both personal and business needs.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

export function PincodeFinder({ states }: { states: string[] }) {
  const [isPending, startTransition] = useTransition();

  const [divisions, setDivisions] = useState<string[]>([]);
  const [postOffices, setPostOffices] = useState<PostOffice[]>([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');
  
  const [isLoadingDivisions, setIsLoadingDivisions] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (selectedState) {
      setIsLoadingDivisions(true);
      setDivisions([]);
      setSelectedDivision('');
      getDivisions(selectedState).then(d => {
        setDivisions(d);
        setIsLoadingDivisions(false);
      });
    } else {
      setDivisions([]);
      setSelectedDivision('');
    }
  }, [selectedState]);

  useEffect(() => {
    const isSearching = selectedState || selectedDivision || searchTerm || selectedLetter;
    if (isSearching) {
        setHasSearched(true);
        startTransition(() => {
            findPostOffices({
                state: selectedState,
                division: selectedDivision,
                searchTerm,
                letter: selectedLetter,
            }).then(setPostOffices);
        });
    } else {
        setHasSearched(false);
        setPostOffices([]);
    }
  }, [selectedState, selectedDivision, searchTerm, selectedLetter]);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
  };

  const handleDivisionChange = (division: string) => {
    setSelectedDivision(division);
  };

  const handleLetterChange = (letter: string) => {
    setSelectedLetter(letter === 'all' ? '' : letter);
  };
  
  const clearFilters = () => {
    setSelectedState('');
    setSelectedDivision('');
    setSearchTerm('');
    setSelectedLetter('');
    setDivisions([]);
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <Card className="w-full shadow-lg border-none">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline tracking-tight text-primary">Welcome to digi-pincode</CardTitle>
        <CardDescription>An elegant way to find any post office across India.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select onValueChange={handleStateChange} value={selectedState}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a State" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-72">
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
            <Select onValueChange={handleDivisionChange} value={selectedDivision} disabled={!selectedState || isLoadingDivisions}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={isLoadingDivisions ? "Loading..." : "Select a Division"} />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-72">
                  {divisions.map((division) => (
                    <SelectItem key={division} value={division}>{division}</SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Branch Name"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select onValueChange={handleLetterChange} value={selectedLetter}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by Letter" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {alphabet.map(letter => (
                        <SelectItem key={letter} value={letter}>{letter}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
           <div className="flex justify-center pt-4">
            <Button variant="ghost" onClick={clearFilters} className="text-primary hover:text-primary">
              <X className="mr-2 h-4 w-4" />
              Clear All Filters
            </Button>
           </div>
        </div>

        {hasSearched ? (
        <div className="w-full">
            <div className="hidden md:block">
              <ScrollArea className="h-[500px] border rounded-lg">
                <Table>
                  <TableHeader className="sticky top-0 bg-card">
                    <TableRow>
                      <TableHead>Office Name</TableHead>
                      <TableHead>Pincode</TableHead>
                      <TableHead>Office Type</TableHead>
                      <TableHead>Taluka</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Division</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Circle</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isPending ? (
                      <TableRow>
                        <TableCell colSpan={8}>
                          <div className='space-y-2'>
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : postOffices.length > 0 ? (
                      postOffices.map((po, index) => (
                        <TableRow key={`${po.officename}-${po.pincode}-${index}`}>
                          <TableCell className="font-medium">{po.officename}</TableCell>
                          <TableCell>{po.pincode}</TableCell>
                          <TableCell>{po.officetype}</TableCell>
                          <TableCell>{po.Taluk}</TableCell>
                          <TableCell>{po.statename}</TableCell>
                          <TableCell>{po.divisionname}</TableCell>
                          <TableCell>{po.regionname}</TableCell>
                          <TableCell>{po.circlename}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                           No results found. Try adjusting your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
            <div className="block md:hidden">
                <ScrollArea className="h-[500px]">
                    <div className="space-y-4">
                    {isPending ? (
                        <div className='space-y-4'>
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    ) : postOffices.length > 0 ? (
                        postOffices.map((po, index) => (
                            <Card key={`${po.officename}-${po.pincode}-${index}`} className="border rounded-lg p-4">
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <div className="font-semibold col-span-2 text-base">{po.officename}</div>
                                    
                                    <div className="text-muted-foreground">Pincode</div>
                                    <div>{po.pincode}</div>
                                    
                                    <div className="text-muted-foreground">Type</div>
                                    <div>{po.officetype}</div>

                                    <div className="text-muted-foreground">Taluka</div>
                                    <div>{po.Taluk}</div>
                                    
                                    <div className="text-muted-foreground">State</div>
                                    <div>{po.statename}</div>

                                    <div className="text-muted-foreground">Division</div>
                                    <div>{po.divisionname}</div>

                                    <div className="text-muted-foreground">Region</div>
                                    <div>{po.regionname}</div>

                                    <div className="text-muted-foreground">Circle</div>
                                    <div>{po.circlename}</div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="h-24 flex items-center justify-center text-center text-muted-foreground">
                            No results found. Try adjusting your filters.
                        </div>
                    )}
                    </div>
                </ScrollArea>
            </div>
        </div>
        ) : (
            <FaqSection />
        )}
      </CardContent>
    </Card>
  );
}
