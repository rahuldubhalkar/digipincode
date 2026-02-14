
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { PostOffice } from '@/lib/types';

interface SearchFormProps {
  states: string[];
  initialState?: string;
  initialDistrict?: string;
  initialSearchTerm?: string;
  initialLetter?: string;
}

export function SearchForm({
  states,
  initialState = '',
  initialDistrict = '',
  initialSearchTerm = '',
  initialLetter = ''
}: SearchFormProps) {
  const router = useRouter();

  const [selectedState, setSelectedState] = useState(initialState);
  const [districts, setDistricts] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [letter, setLetter] = useState(initialLetter);
  
  const alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  useEffect(() => {
    if (selectedState) {
      fetch(`/data/${selectedState}.json`)
        .then(res => res.json())
        .then((postOffices: PostOffice[]) => {
          const uniqueDistricts = [...new Set(postOffices.map(po => po.district).filter(Boolean))].sort();
          setDistricts(uniqueDistricts);
          if (initialDistrict && !uniqueDistricts.includes(initialDistrict)) {
            setSelectedDistrict('');
          }
        });
    } else {
      setDistricts([]);
      setSelectedDistrict('');
    }
  }, [selectedState, initialDistrict]);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedDistrict(''); // Reset district when state changes
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedState) return;
    const params = new URLSearchParams();
    params.set('state', selectedState);
    if (selectedDistrict) {
      params.set('district', selectedDistrict);
    }
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
      setSelectedDistrict('');
      setSearchTerm('');
      setLetter('');
      setDistricts([]);
      router.push('/');
  }

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div className="space-y-2">
            <label className="text-sm font-medium">Select a State</label>
            <Select onValueChange={handleStateChange} value={selectedState} suppressHydrationWarning>
              <SelectTrigger className="w-full" suppressHydrationWarning>
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
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium">Select a District</label>
            <Select onValueChange={setSelectedDistrict} value={selectedDistrict} disabled={!selectedState || districts.length === 0} suppressHydrationWarning>
                <SelectTrigger className="w-full" suppressHydrationWarning>
                    <SelectValue placeholder="Select a District" />
                </SelectTrigger>
                <SelectContent>
                    <ScrollArea className="h-72">
                        {districts.map((district) => (
                            <SelectItem key={district} value={district}>{district}</SelectItem>
                        ))}
                    </ScrollArea>
                </SelectContent>
            </Select>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium">Search by Post Office</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="e.g. Main Post Office"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
                suppressHydrationWarning
              />
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium">Filter by First Letter</label>
            <Select onValueChange={setLetter} value={letter} suppressHydrationWarning>
                <SelectTrigger className="w-full" suppressHydrationWarning>
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
             <Button type="button" variant="outline" onClick={clearSearch} className="text-primary hover:text-primary" suppressHydrationWarning>
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
        </div>
      </div>
    </form>
  );
}
