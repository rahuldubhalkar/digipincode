"use client";

import { useState, useEffect, useTransition, useCallback, memo } from 'react';
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
import { Skeleton } from './ui/skeleton';
import { useTranslation } from '@/lib/i18n/use-translation';
import { StateDetails } from './state-details';

export interface PincodeFinderProps {
  states: string[];
  allStatesData: { [state: string]: PostOffice[] };
  selectedStateFromZone?: string;
  onClear: () => void;
}

function PincodeFinderComponent({ states, allStatesData, selectedStateFromZone, onClear }: PincodeFinderProps) {
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

  useEffect(() => {
    if (selectedStateFromZone) {
      handleStateChange(selectedStateFromZone);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStateFromZone]);

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

  useEffect(() => {
    setIsLoadingStateData(true);
    setFilteredPostOffices([]);
    setSelectedDivision('');
    setSelectedDistrict('');
    setSearchTerm('');
    setSelectedLetter('');

    if (selectedState && allStatesData[selectedState]) {
      const offices = allStatesData[selectedState];
      setAllPostOfficesForState(offices);
      setFilteredPostOffices(offices.sort((a, b) => a.officename.localeCompare(b.officename)));
    } else {
      setAllPostOfficesForState([]);
      setFilteredPostOffices([]);
    }
    setIsLoadingStateData(false);
  }, [selectedState, allStatesData]);

  useEffect(() => {
    startTransition(() => {
      applyFilters(allPostOfficesForState);
    });
  }, [allPostOfficesForState, selectedDivision, selectedDistrict, searchTerm, selectedLetter, applyFilters]);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
  };

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
    onClear();
    setSelectedState('');
    setSelectedDivision('');
    setSelectedDistrict('');
    setSearchTerm('');
    setSelectedLetter('');
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
              <SelectTrigger className="w-full">
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
              />
            </div>
            <Select onValueChange={handleLetterChange} value={selectedLetter} disabled={!selectedState}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('home.filterByLetter')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">{t('home.allLetters')}</SelectItem>
                    {alphabet.map(letter => (
                        <SelectItem key={letter} value={letter}>{letter}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button variant="outline" onClick={clearFilters} className="text-primary hover:text-primary">
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
                <div className="mt-8 hidden md:block">
                <ScrollArea className="h-[500px] border rounded-lg">
                    <Table>
                    <TableHeader className="sticky top-0 bg-card z-10">
                        <TableRow>
                        <TableHead>{t('table.officeName')}</TableHead>
                        <TableHead>{t('table.pincode')}</TableHead>
                        <TableHead>{t('table.officeType')}</TableHead>
                        <TableHead>{t('table.division')}</TableHead>
                        <TableHead>{t('table.region')}</TableHead>
                        <TableHead>{t('table.circle')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(isPending || isLoadingStateData) ? (
                        <TableRow>
                            <TableCell colSpan={6}>
                            <div className="space-y-2 p-4">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                            </TableCell>
                        </TableRow>
                        ) : filteredPostOffices.length > 0 ? (
                        filteredPostOffices.map((po, index) => (
                            <TableRow key={`${po.officename}-${po.pincode}-${index}`}>
                            <TableCell className="font-medium">{po.officename}</TableCell>
                            <TableCell>{po.pincode}</TableCell>
                            <TableCell>{po.officetype}</TableCell>
                            <TableCell>{po.divisionname}</TableCell>
                            <TableCell>{po.regionname}</TableCell>
                            <TableCell>{po.circlename}</TableCell>
                            </TableRow>
                        ))
                        ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                {isAnyFilterActive ? t('home.noResults') : t('home.selectFilter')}
                            </TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </ScrollArea>
                </div>
                <div className="mt-8 block md:hidden">
                    <ScrollArea className="h-[500px]">
                        <div className="space-y-4">
                        {(isPending || isLoadingStateData) ? (
                            <div className='space-y-4'>
                                <Skeleton className="h-32 w-full" />
                                <Skeleton className="h-32 w-full" />
                                <Skeleton className="h-32 w-full" />
                            </div>
                        ) : filteredPostOffices.length > 0 ? (
                            filteredPostOffices.map((po, index) => (
                                <Card key={`${po.officename}-${po.pincode}-${index}`} className="border rounded-lg p-4">
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                        <div className="font-semibold col-span-2 text-base">{po.officename}</div>
                                        
                                        <div className="text-muted-foreground">{t('table.pincode')}</div>
                                        <div>{po.pincode}</div>
                                        
                                        <div className="text-muted-foreground">{t('table.officeType')}</div>
                                        <div>{po.officetype}</div>
                                        
                                        <div className="text-muted-foreground">{t('table.division')}</div>
                                        <div>{po.divisionname}</div>

                                        <div className="text-muted-foreground">{t('table.region')}</div>
                                        <div>{po.regionname}</div>

                                        <div className="text-muted-foreground">{t('table.circle')}</div>
                                        <div>{po.circlename}</div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="h-24 flex items-center justify-center text-center text-muted-foreground">
                                {isAnyFilterActive ? t('home.noResults') : t('home.selectFilter')}
                            </div>
                        )}
                        </div>
                    </ScrollArea>
                </div>
                </>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

export const PincodeFinder = memo(PincodeFinderComponent);
