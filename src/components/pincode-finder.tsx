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

export function PincodeFinder({ states }: { states: string[] }) {
  const [isPending, startTransition] = useTransition();

  const [divisions, setDivisions] = useState<string[]>([]);
  const [postOffices, setPostOffices] = useState<PostOffice[]>([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');
  
  const [isLoadingDivisions, setIsLoadingDivisions] = useState(false);

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
    startTransition(() => {
      findPostOffices({
        state: selectedState,
        division: selectedDivision,
        searchTerm,
        letter: selectedLetter,
      }).then(setPostOffices);
    });
  }, [selectedState, selectedDivision, searchTerm, selectedLetter]);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
  };

  const handleDivisionChange = (division: string) => {
    setSelectedDivision(division);
  };

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(prev => (prev === letter ? '' : letter));
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
      <CardHeader>
        <CardTitle className="text-3xl font-headline tracking-tight text-primary">digi-pincode</CardTitle>
        <CardDescription>An elegant way to find any post office across India.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          </div>
          <div className="flex flex-wrap gap-1 md:gap-2 justify-center pt-4">
            {alphabet.map(letter => (
              <Button
                key={letter}
                variant={selectedLetter === letter ? 'default' : 'outline'}
                size="icon"
                className="h-8 w-8 md:h-9 md:w-9"
                onClick={() => handleLetterClick(letter)}
              >
                {letter}
              </Button>
            ))}
          </div>
           <div className="flex justify-center">
            <Button variant="ghost" onClick={clearFilters} className="text-primary hover:text-primary">
              <X className="mr-2 h-4 w-4" />
              Clear All Filters
            </Button>
           </div>
        </div>

        <div>
          <ScrollArea className="h-[500px] border rounded-lg">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>Office Name</TableHead>
                  <TableHead>Pincode</TableHead>
                  <TableHead>Office Type</TableHead>
                  <TableHead>Taluk</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Circle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                  <TableRow>
                    <TableCell colSpan={9}>
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
                      <TableCell>{po.district}</TableCell>
                      <TableCell>{po.statename}</TableCell>
                      <TableCell>{po.divisionname}</TableCell>
                      <TableCell>{po.regionname}</TableCell>
                      <TableCell>{po.circlename}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                       No results found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
