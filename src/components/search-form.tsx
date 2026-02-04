
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface SearchFormProps {
  states: string[];
  initialState?: string;
  initialSearchTerm?: string;
  initialLetter?: string;
}

export function SearchForm({ states, initialState = '', initialSearchTerm = '', initialLetter = '' }: SearchFormProps) {
  const router = useRouter();

  const [selectedState, setSelectedState] = useState(initialState);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [letter, setLetter] = useState(initialLetter);
  
  const alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedState) return;
    const params = new URLSearchParams();
    params.set('state', selectedState);
    if (searchTerm) {
      params.set('q', searchTerm);
    }
    if (letter) {
      params.set('letter', letter);
    }
    router.push(`/search?${params.toString()}`);
  };

  const clearSearch = () => {
      setSelectedState('');
      setSearchTerm('');
      setLetter('');
      router.push('/');
  }

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="space-y-2">
            <label className="text-sm font-medium">Select a State to Find Pincode</label>
            <Select onValueChange={setSelectedState} value={selectedState}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a State to Find Pincode" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-72">
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium">Search by Branch Post Office Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Branch Post Office Name"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium">Filter by First Letter</label>
            <Select onValueChange={setLetter} value={letter}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="e.g. A" />
                </SelectTrigger>
                <SelectContent>
                    <ScrollArea className="h-72">
                        {alphabets.map((alpha) => (
                            <SelectItem key={alpha} value={alpha}>{alpha}</SelectItem>
                        ))}
                    </ScrollArea>
              </SelectContent>
            </Select>
        </div>

        <div className="flex gap-2">
            <Button type="submit" disabled={!selectedState} className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
             <Button type="button" variant="outline" onClick={clearSearch} className="text-primary hover:text-primary">
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
        </div>
      </div>
    </form>
  );
}
