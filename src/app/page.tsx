
"use client";

import { PincodeFinder } from '@/components/pincode-finder';
import { PincodeZoneList } from '@/components/pincode-zone-list';
import { getStates } from '@/lib/data';
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/use-translation';
import { PincodeFinderLoader } from '@/components/pincode-finder-loader';

function PincodeFinderSkeleton() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex justify-center pt-4">
                <Skeleton className="h-10 w-28" />
            </div>
            <div className="max-w-3xl mx-auto border rounded-lg p-6">
                <Skeleton className="h-8 w-1/2 mx-auto mb-4" />
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
      </div>
    )
}

export default function Home() {
  const { t } = useTranslation();
  const [states, setStates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStateFromZone, setSelectedStateFromZone] = useState('');
  const finderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getStates().then(states => {
      setStates(states);
      setIsLoading(false);
    });
  }, []);

  const handleZoneSelect = useCallback((state: string) => {
    setSelectedStateFromZone(state);
    if (finderRef.current) {
      finderRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  
  const handleClear = useCallback(() => {
    setSelectedStateFromZone('');
  }, []);

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


  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
      <div ref={finderRef}>
        {isLoading ? <PincodeFinderSkeleton /> : <PincodeFinderLoader states={states} selectedStateFromZone={selectedStateFromZone} onClear={handleClear} />}
      </div>

      <PincodeZoneList onZoneSelect={handleZoneSelect} />
      
      <Card className="w-full shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-2xl font-headline tracking-tight text-center">{t('faq.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
                {faqItems.map((item, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>{item.question}</AccordionTrigger>
                        <AccordionContent>
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
          </CardContent>
        </Card>
    </main>
  );
}

