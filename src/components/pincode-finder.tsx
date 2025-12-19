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

export function PincodeFinder({ states }: { states: string[] }) {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const [divisions, setDivisions] = useState<string[]>([]);
  const [postOffices, setPostOffices] = useState<PostOffice[]>([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');
  const [searched, setSearched] = useState(false);
  
  const [isLoadingDivisions, setIsLoadingDivisions] = useState(false);

  const performSearch = useCallback((state = selectedState, division = selectedDivision, term = searchTerm, letter = selectedLetter) => {
    if (!state || !division) {
      setPostOffices([]);
      return;
    };
    setSearched(true);
    startTransition(() => {
      findPostOffices({
        state,
        division,
        searchTerm: term,
        letter: letter,
      }).then(offices => {
        const sortedOffices = offices.sort((a, b) => a.officename.localeCompare(b.officename));
        setPostOffices(sortedOffices);
      });
    });
  }, [selectedState, selectedDivision, searchTerm, selectedLetter]);

  
  useEffect(() => {
    if (selectedState) {
      setIsLoadingDivisions(true);
      setDivisions([]);
      setSelectedDivision('');
      setPostOffices([]);
      getDivisions(selectedState).then(d => {
        setDivisions(d);
        setIsLoadingDivisions(false);
      });
    } else {
      setDivisions([]);
      setSelectedDivision('');
      setPostOffices([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState]);

  const handleStateChange = (state: string) => {
    setSearchTerm('');
    setSelectedLetter('');
    setSelectedState(state);
  };

  const handleDivisionChange = (division: string) => {
    setSearchTerm('');
    setSelectedLetter('');
    setSelectedDivision(division);
    performSearch(selectedState, division, '', '');
  };
  
  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
     if (selectedState && selectedDivision) {
      performSearch(selectedState, selectedDivision, term, selectedLetter);
    }
  }

  const handleLetterChange = (letter: string) => {
    const newLetter = letter === 'all' ? '' : letter;
    setSelectedLetter(newLetter);
    if (selectedState && selectedDivision) {
      performSearch(selectedState, selectedDivision, searchTerm, newLetter);
    }
  };
  
  const clearFilters = () => {
    setSelectedState('');
    setSelectedDivision('');
    setSearchTerm('');
    setSelectedLetter('');
    setPostOffices([]);
    setSearched(false);
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  const faqItems = [
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
    }
  ];

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
                onChange={e => handleSearchTermChange(e.target.value)}
                className="pl-10"
                disabled={!selectedDivision}
              />
            </div>
            <Select onValueChange={handleLetterChange} value={selectedLetter} disabled={!selectedDivision}>
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

        <div className="w-full">
            { !searched && postOffices.length === 0 ? (
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
            ) : (
                <>
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
                            <div className="space-y-2 p-4">
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
                </>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
