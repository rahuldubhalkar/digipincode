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
import { useTranslation } from '@/lib/i18n/use-translation';

function FaqSection() {
  const { t } = useTranslation();
    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-center">{t('faq.title')}</h3>
            <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
                <AccordionItem value="item-1">
                    <AccordionTrigger>{t('faq.q1.question')}</AccordionTrigger>
                    <AccordionContent>
                        {t('faq.q1.answer')}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>{t('faq.q2.question')}</AccordionTrigger>
                    <AccordionContent>
                        {t('faq.q2.answer')}
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-3">
                    <AccordionTrigger>{t('faq.q3.question')}</AccordionTrigger>
                    <AccordionContent>
                        {t('faq.q3.answer')}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

export function PincodeFinder({ states }: { states: string[] }) {
  const { t } = useTranslation();
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
            <Select onValueChange={handleDivisionChange} value={selectedDivision} disabled={!selectedState || isLoadingDivisions}>
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
              />
            </div>
            <Select onValueChange={handleLetterChange} value={selectedLetter}>
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
          </div>
           <div className="flex justify-center pt-4">
            <Button variant="ghost" onClick={clearFilters} className="text-primary hover:text-primary">
              <X className="mr-2 h-4 w-4" />
              {t('home.clearFilters')}
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
                      <TableHead>{t('table.officeName')}</TableHead>
                      <TableHead>{t('table.pincode')}</TableHead>
                      <TableHead>{t('table.officeType')}</TableHead>
                      <TableHead>{t('table.taluka')}</TableHead>
                      <TableHead>{t('table.state')}</TableHead>
                      <TableHead>{t('table.division')}</TableHead>
                      <TableHead>{t('table.region')}</TableHead>
                      <TableHead>{t('table.circle')}</TableHead>
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
                           {t('home.noResults')}
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
                                    
                                    <div className="text-muted-foreground">{t('table.pincode')}</div>
                                    <div>{po.pincode}</div>
                                    
                                    <div className="text-muted-foreground">{t('table.officeType')}</div>
                                    <div>{po.officetype}</div>

                                    <div className="text-muted-foreground">{t('table.taluka')}</div>
                                    <div>{po.Taluk}</div>
                                    
                                    <div className="text-muted-foreground">{t('table.state')}</div>
                                    <div>{po.statename}</div>

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
                            {t('home.noResults')}
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