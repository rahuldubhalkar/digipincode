
import { PincodeFinderWrapper } from '@/components/pincode-finder-wrapper';
import { PincodeZoneList } from '@/components/pincode-zone-list';
import { getStates, getPostOfficesByState } from '@/lib/data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PostOffice } from '@/lib/types';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { promises as fs } from 'fs';
import path from 'path';


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


async function getFaqItems(t: (key: string) => string) {
    return [
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
      ];
}

type StateData = {
  [state: string]: PostOffice[];
};

export default async function Home() {
  const states = await getStates();
  
  // This is a placeholder for a translation function on the server
  const t = (key: string) => {
    // In a real app, you'd use a server-side i18n library
    // For now, we'll just use the key itself or a simple map.
    const keyParts = key.split('.');
    return keyParts[keyParts.length - 1];
  };

  const faqItems = await getFaqItems(t);
  
  // Pre-fetch data for all states at build time
  const allStatesData: StateData = {};
  let allPostOffices: PostOffice[] = [];

  const allStatesPromises = states.map(async (state) => {
    const postOffices = await getPostOfficesByState(state);
    allStatesData[state] = postOffices;
    allPostOffices = allPostOffices.concat(postOffices);
  });
  await Promise.all(allStatesPromises);

  // Write all post offices to a static JSON file in the public directory
  const publicDir = path.join(process.cwd(), 'public');
  await fs.mkdir(publicDir, { recursive: true });
  await fs.writeFile(path.join(publicDir, 'all_post_offices.json'), JSON.stringify(allPostOffices));


  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
       <Suspense fallback={<PincodeFinderSkeleton />}>
        <PincodeFinderWrapper states={states} allStatesData={allStatesData} />
      </Suspense>
      
      <PincodeZoneList onZoneSelect={() => {}} />
      
      <Card className="w-full shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-2xl font-headline tracking-tight text-center">Post Office & PIN Code Search - Frequently Asked Questions</CardTitle>
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
