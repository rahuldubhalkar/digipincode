
"use client";

import { useState, useEffect, useTransition, useCallback } from 'react';
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

export function PincodeFinder({ states }: { states: string[] }) {
  const [isPending, startTransition] = useTransition();

  const [divisions, setDivisions] = useState<string[]>([]);
  const [postOffices, setPostOffices] = useState<PostOffice[]>([]);

  const [selectedState, setSelectedState] = useState('MAHARASHTRA');
  const [selectedDivision, setSelectedDivision] = useState('Nagpur City');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');
  
  const [isLoadingDivisions, setIsLoadingDivisions] = useState(false);

  const performSearch = useCallback(() => {
    if (!selectedState || !selectedDivision) {
      setPostOffices([]);
      return;
    };
    startTransition(() => {
      findPostOffices({
        state: selectedState,
        division: selectedDivision,
        searchTerm,
        letter: selectedLetter,
      }).then(setPostOffices);
    });
  }, [selectedState, selectedDivision, searchTerm, selectedLetter]);

  
  useEffect(() => {
    if (selectedState && selectedDivision) {
      performSearch();
    }
  }, [selectedState, selectedDivision, searchTerm, selectedLetter]);


  useEffect(() => {
    if (selectedState) {
      setIsLoadingDivisions(true);
      getDivisions(selectedState).then(d => {
        setDivisions(d);
        // If the current division is not in the new list of divisions, reset it.
        // But for the initial load of MAHARASHTRA, we want to keep Nagpur City.
        if (!d.includes(selectedDivision) && selectedState !== 'MAHARASHTRA') {
            setSelectedDivision(d[0] || '');
        } else if (selectedState === 'MAHARASHTRA' && !d.includes('Nagpur City')) {
            // This handles case where Nagpur City might not be in the list for some reason
            setSelectedDivision(d[0] || '');
        }
        setIsLoadingDivisions(false);
      });
    } else {
      setDivisions([]);
      setSelectedDivision('');
      setIsLoadingDivisions(false);
    }
  }, [selectedState]);


  const handleStateChange = (state: string) => {
    setSelectedState(state);
    if (state !== 'MAHARASHTRA') {
        setSelectedDivision(''); // Reset division when state changes, unless it's the default
    } else {
        setSelectedDivision('Nagpur City');
    }
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
    setPostOffices([]);
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <Card className="w-full shadow-lg border-none">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline tracking-tight text-primary">Welcome to digi-pincode</CardTitle>
        <CardDescription>An elegant way to find any post office across India</CardDescription>
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

        <div className="w-full">
            <div className="hidden md:block">
              <ScrollArea className="h-[500px] border rounded-lg">
                <Table>
                  <TableHeader className="sticky top-0 bg-card">
                    <TableRow>
                      <TableHead>Office Name</TableHead>
                      <TableHead>Pincode</TableHead>
                      <TableHead>Office Type</TableHead>
                      <TableHead>Taluk</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Division</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Circle</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isPending ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          Loading data...
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
                                    
                                    <div className="text-muted-foreground">Office Type</div>
                                    <div>{po.officetype}</div>

                                    <div className="text-muted-foreground">Taluk</div>
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
                            No results found.
                        </div>
                    )}
                    </div>
                </ScrollArea>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
