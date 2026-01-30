
"use client";

import { useState, useEffect, useTransition, useCallback, memo } from 'react';
import type { PostOffice } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useTranslation } from '@/lib/i18n/use-translation';
import { StateDetails } from './state-details';
import { PostOfficeTable } from './post-office-table';

export interface PincodeFinderProps {
  states: string[];
}

function PincodeFinderComponent({ states }: PincodeFinderProps) {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const [allPostOfficesForState, setAllPostOfficesForState] = useState<PostOffice[]>([]);
  const [filteredPostOffices, setFilteredPostOffices] = useState<PostOffice[]>([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');
  
  const [isLoadingStateData, setIsLoadingStateData] = useState(false);


  const applyFilters = useCallback((offices: PostOffice[]) => {
    let filtered = offices;

    if (selectedDivision) {
      filtered = filtered.filter(po => po.divisionname === selectedDivision);
    }
    if (selectedDistrict) {
      filtered = filtered.filter(po => po.district === selectedDistrict);
    }
    if (searchTerm) {
      filtered = filtered.filter(po => po.officename.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedLetter && selectedLetter !== 'all') {
      filtered = filtered.filter(po => po.officename.toLowerCase().startsWith(selectedLetter.toLowerCase()));
    }

    const sortedOffices = filtered.sort((a, b) => a.officename.localeCompare(b.officename));
    setFilteredPostOffices(sortedOffices);
  }, [selectedDivision, selectedDistrict, searchTerm, selectedLetter]);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    
    setIsLoadingStateData(true);
    setFilteredPostOffices([]);
    setSelectedDivision('');
    setSelectedDistrict('');
    setSearchTerm('');
    setSelectedLetter('');

    if (!state) {
        setAllPostOfficesForState([]);
        setIsLoadingStateData(false);
        return;
    }

    startTransition(async () => {
        try {
            const res = await fetch(`/data/${state}.json`);
            const offices = await res.json();
            setAllPostOfficesForState(offices);
            applyFilters(offices);
        } catch (error) {
            console.error(`Failed to load data for state: ${state}`, error);
            setAllPostOfficesForState([]);
        } finally {
            setIsLoadingStateData(false);
        }
    });
  };

  useEffect(() => {
    startTransition(() => {
      applyFilters(allPostOfficesForState);
    });
  }, [allPostOfficesForState, selectedDivision, selectedDistrict, searchTerm, selectedLetter, applyFilters]);

  const handleDivisionChange = (division: string) => {
    setSelectedDistrict('');
    setSelectedDivision(division === selectedDivision ? '' : division);
  };
  
  const handleDistrictChange = (district: string) => {
    setSelectedDivision('');
    setSelectedDistrict(district === selectedDistrict ? '' : district);
  }
  
  const handleLetterChange = (letter: string) => {
    if (letter === "all") {
      setSelectedLetter("");
    } else {
      setSelectedLetter(letter);
    }
  };
  
  const clearFilters = () => {
    setSelectedState('');
    setSelectedDivision('');
    setSelectedDistrict('');
    setSearchTerm('');
    setSelectedLetter('');
    setAllPostOfficesForState([]);
    setFilteredPostOffices([]);
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const isAnyFilterActive = selectedDivision || selectedDistrict || searchTerm || selectedLetter;

  return (
    <Card className="w-full shadow-lg border-none">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline tracking-tight text-primary">{t('home.title')}</CardTitle>
        <CardDescription>{t('home.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select onValueChange={handleStateChange} value={selectedState}>
              <SelectTrigger className="w-full" suppressHydrationWarning>
                <SelectValue placeholder={t('home.selectState')} />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-72">
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('home.searchByBranch')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={!selectedState}
                suppressHydrationWarning
              />
            </div>
            <Select onValueChange={handleLetterChange} value={selectedLetter} disabled={!selectedState}>
                <SelectTrigger className="w-full" suppressHydrationWarning>
                    <SelectValue placeholder={t('home.filterByLetter')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">{t('home.allLetters')}</SelectItem>
                    {alphabet.map(letter => (
                        <SelectItem key={letter} value={letter}>{letter}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button variant="outline" onClick={clearFilters} className="text-primary hover:text-primary" suppressHydrationWarning>
              <X className="mr-2 h-4 w-4" />
              {t('home.clearFilters')}
            </Button>
          </div>
        </div>

        <div className="w-full">
            { !selectedState ? (
                <div className="text-center p-8 text-muted-foreground">
                    <p>{t('home.selectFilter')}</p>
                </div>
            ) : isLoadingStateData ? (
                 <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-[500px] w-full" />
                 </div>
            ) : (
                <>
                <StateDetails 
                    selectedState={selectedState} 
                    allPostOffices={allPostOfficesForState}
                    onDistrictSelect={handleDistrictChange}
                    selectedDistrict={selectedDistrict}
                    onDivisionSelect={handleDivisionChange}
                    selectedDivision={selectedDivision}
                />
                <div className="mt-8">
                    <PostOfficeTable postOffices={filteredPostOffices} searched={isAnyFilterActive} />
                </div>
                </>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

export const PincodeFinder = memo(PincodeFinderComponent);
