
"use client";

import { useState, useEffect, useTransition, useCallback, useMemo } from 'react';
import type { PostOffice } from '@/lib/types';
import { getDivisions, findPostOffices, getPostOfficesByState } from '@/lib/data';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, X } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { useTranslation } from '@/lib/i18n/use-translation';
import { StateDetails } from './state-details';

export interface PincodeFinderProps {
  states: string[];
  selectedStateFromZone?: string;
  onClear: () => void;
}

export function PincodeFinder({ states, selectedStateFromZone, onClear }: PincodeFinderProps) {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const [divisions, setDivisions] = useState<string[]>([]);
  const [allPostOfficesForState, setAllPostOfficesForState] = useState<PostOffice[]>([]);
  const [filteredPostOffices, setFilteredPostOffices] = useState<PostOffice[]>([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');
  
  const [isLoadingDivisions, setIsLoadingDivisions] = useState(false);
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
    if (selectedLetter) {
      filtered = filtered.filter(po => po.officename.toLowerCase().startsWith(selectedLetter.toLowerCase()));
    }

    const sortedOffices = filtered.sort((a, b) => a.officename.localeCompare(b.officename));
    setFilteredPostOffices(sortedOffices);
  }, [selectedDivision, selectedDistrict, searchTerm, selectedLetter]);

  useEffect(() => {
    if (selectedState) {
      setIsLoadingDivisions(true);
      setIsLoadingStateData(true);
      
      setDivisions([]);
      setAllPostOfficesForState([]);
      setFilteredPostOffices([]);
      setSelectedDivision('');
      setSelectedDistrict('');
      setSearchTerm('');
      setSelectedLetter('');

      startTransition(() => {
        getDivisions(selectedState).then(d => {
          setDivisions(d);
          setIsLoadingDivisions(false);
        });

        getPostOfficesByState(selectedState).then(offices => {
          setAllPostOfficesForState(offices);
          setFilteredPostOffices(offices.sort((a, b) => a.officename.localeCompare(b.officename)));
          setIsLoadingStateData(false);
        });
      });

    } else {
      setDivisions([]);
      setAllPostOfficesForState([]);
      setFilteredPostOffices([]);
    }
  }, [selectedState]);

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
    setSelectedDivision(division);
  };
  
  const handleDistrictChange = (district: string) => {
    setSelectedDivision('');
    setSelectedDistrict(district);
  }
  
  const clearFilters = () => {
    onClear();
    setSelectedState('');
    setSelectedDivision('');
    setSelectedDistrict('');
    setSearchTerm('');
    setSelectedLetter('');
    setAllPostOfficesForState([]);
    setFilteredPostOffices([]);
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  const faqItems = useMemo(() => [
    {
      question: t('faq.q1.question'),
      answer: t('faq.q1.answer'),
    },
    {
      question: t('faq.q2.question'),
      answer: t('faq.q2.answer'),
    },
    {
      question: t('faq.q3.question'),
      answer: t('faq.q3.answer'),
    },
    {
      question: t('faq.q4.question'),
      answer: t('faq.q4.answer'),
    },
    {
      question: t('faq.q5.question'),
      answer: t('faq.q5.answer'),
    },
    {
      question: t('faq.q6.question'),
      answer: t('faq.q6.answer'),
    },
    {
      question: t('faq.q7.question'),
      answer: t('faq.q7.answer'),
    },
  ], [t]);

  const isAnyFilterActive = selectedDivision || selectedDistrict || searchTerm || selectedLetter;

  return (
    <Card className="w-full shadow-lg border-none">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline tracking-tight text-primary">{t('home.title')}</CardTitle>
        <CardDescription>{t('header.tagline')}</CardDescription>
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
            <Select onValueChange={handleDivisionChange} value={selectedDivision} disabled={!selectedState || isLoadingDivisions || !!selectedDistrict}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={isLoadingDivisions ? t('home.loading') : t('home.selectDivision')} />
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
                placeholder={t('home.searchByBranch')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={!selectedState}
              />
            </div>
            <Select onValueChange={setSelectedLetter} value={selectedLetter} disabled={!selectedState}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('home.filterByLetter')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="">{t('home.allLetters')}</SelectItem>
                    {alphabet.map(letter => (
                        <SelectItem key={letter} value={letter}>{letter}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
           <div className="flex justify-center pt-4">
            <Button variant="ghost" onClick={clearFilters} className="text-primary hover:text-primary">
              <X className="mr-2 h-4 w-4" />
              {t('home.clearFilters')}
            </Button>
           </div>
        </div>

        <div className="w-full">
            { !selectedState ? (
                <div className="max-w-3xl mx-auto border rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-center">{t('faq.title')}</h3>
                    <Accordion type="single" collapsible className="w-full">
                        {faqItems.map((item, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>{item.question}</AccordionTrigger>
                                <AccordionContent>
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
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
                />
                <div className="mt-8 hidden md:block">
                <ScrollArea className="h-[500px] border rounded-lg">
                    <Table>
                    <TableHeader className="sticky top-0 bg-card z-10">
                        <TableRow>
                        <TableHead>{t('table.officeName')}</TableHead>
                        <TableHead>{t('table.pincode')}</TableHead>
                        <TableHead>{t('table.officeType')}</TableHead>
                        <TableHead>{t('table.district')}</TableHead>
                        <TableHead>{t('table.division')}</TableHead>
                        <TableHead>{t('table.region')}</TableHead>
                        <TableHead>{t('table.circle')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isPending ? (
                        <TableRow>
                            <TableCell colSpan={7}>
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
                            <TableCell>{po.district}</TableCell>
                            <TableCell>{po.divisionname}</TableCell>
                            <TableCell>{po.regionname}</TableCell>
                            <TableCell>{po.circlename}</TableCell>
                            </TableRow>
                        ))
                        ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
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
                        {isPending ? (
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

                                        <div className="text-muted-foreground">{t('table.district')}</div>
                                        <div>{po.district}</div>
                                        
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
