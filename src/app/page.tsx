
import { PincodeFinderWrapper } from '@/components/pincode-finder-wrapper';
import { getStates, getPostOfficesByState } from '@/lib/data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PostOffice } from '@/lib/types';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { promises as fs } from 'fs';
import path from 'path';
import { getTranslation } from '@/lib/i18n/get-translation';

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

export default async function Home() {
  const states = await getStates();
  const t = await getTranslation('en'); // Defaulting to English for build time

  const faqItems = await getFaqItems(t);
  const faqTitle = t('faq.title');
  
  // Pre-fetch data for all states and create individual JSON files at build time
  const publicDataDir = path.join(process.cwd(), 'public', 'data');
  try {
    await fs.mkdir(publicDataDir, { recursive: true });

    let allPostOffices: PostOffice[] = [];

    const allStatesPromises = states.map(async (state) => {
      const postOffices = await getPostOfficesByState(state);
      allPostOffices = allPostOffices.concat(postOffices);
      // Write a JSON file for each state
      await fs.writeFile(path.join(publicDataDir, `${state}.json`), JSON.stringify(postOffices));
    });
    await Promise.all(allStatesPromises);

    // Write a single file with all post offices for the pincode search page
    await fs.writeFile(path.join(publicDataDir, 'all_post_offices.json'), JSON.stringify(allPostOffices));
  } catch (error) {
    console.error("Error during build-time data fetching:", error);
  }


  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
       <Suspense fallback={<PincodeFinderSkeleton />}>
        <PincodeFinderWrapper states={states} />
      </Suspense>
      
      <Card className="w-full shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-2xl font-headline tracking-tight text-center">{faqTitle}</CardTitle>
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
