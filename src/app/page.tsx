

import { getStates } from '@/lib/data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getTranslation } from '@/lib/i18n/get-translation';
import ImageArticles from '@/components/image-articles';
import { PincodeZoneList } from '@/components/pincode-zone-list';
import { SearchForm } from '@/components/search-form';


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
  const t = await getTranslation('en'); 

  const faqItems = await getFaqItems(t);
  const faqTitle = t('faq.title');

  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
        <Card className="w-full shadow-lg border-none">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-headline tracking-tight text-primary">{t('home.title')}</CardTitle>
                <CardDescription>{t('home.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <SearchForm states={states} />
            </CardContent>
        </Card>

        <PincodeZoneList />

        <ImageArticles />
      
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
