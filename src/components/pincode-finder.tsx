"use client";

import { useState, useMemo, useEffect } from 'react';
import type { PostOffice } from '@/lib/types';
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

export function PincodeFinder({ postOffices }: { postOffices: PostOffice[] }) {
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const states = useMemo(() => {
    const stateSet = new Set(postOffices.map(po => po.StateName));
    return Array.from(stateSet).sort();
  }, [postOffices]);

  const districts = useMemo(() => {
    if (!selectedState) return [];
    const districtSet = new Set(
      postOffices
        .filter(po => po.StateName === selectedState)
        .map(po => po.District)
    );
    return Array.from(districtSet).sort();
  }, [postOffices, selectedState]);

  const filteredPostOffices = useMemo(() => {
    // We only filter on the client to avoid hydration issues.
    if (!isClient) {
      return postOffices;
    }
    return postOffices.filter(po => {
      if (selectedState && po.StateName !== selectedState) return false;
      if (selectedDistrict && po.District !== selectedDistrict) return false;
      if (searchTerm && !po.OfficeName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (selectedLetter && !po.OfficeName.toLowerCase().startsWith(selectedLetter.toLowerCase())) return false;
      return true;
    });
  }, [postOffices, selectedState, selectedDistrict, searchTerm, selectedLetter, isClient]);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedDistrict('');
    setSearchTerm('');
    setSelectedLetter('');
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setSearchTerm('');
    setSelectedLetter('');
  };

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(prev => (prev === letter ? '' : letter));
  };
  
  const clearFilters = () => {
    setSelectedState('');
    setSelectedDistrict('');
    setSearchTerm('');
    setSelectedLetter('');
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
                  {states.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
            <Select onValueChange={handleDistrictChange} value={selectedDistrict} disabled={!selectedState}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a City/District" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-72">
                  {districts.map(district => (
                    <SelectItem key={district} value={district}>{district}</SelectItem>
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

        <div className="animate-in fade-in-50 duration-500">
          <ScrollArea className="h-[500px] border rounded-lg">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>Office Name</TableHead>
                  <TableHead>Pincode</TableHead>
                  <TableHead>Taluk</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Circle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPostOffices.length > 0 ? (
                  filteredPostOffices.map(po => (
                    <TableRow key={`${po.OfficeName}-${po.Pincode}`}>
                      <TableCell className="font-medium">{po.OfficeName}</TableCell>
                      <TableCell>{po.Pincode}</TableCell>
                      <TableCell>{po.Taluk}</TableCell>
                      <TableCell>{po.Division}</TableCell>
                      <TableCell>{po.Region}</TableCell>
                      <TableCell>{po.Circle}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
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
