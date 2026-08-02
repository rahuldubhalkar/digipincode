
import { getStates } from '@/lib/data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ImageArticles from '@/components/image-articles';
import { PincodeZoneList } from '@/components/pincode-zone-list';
import { PincodeClientPage } from './pincode/pincode-client-page';
import { getTranslation } from '@/lib/i18n/get-translation';

const faqItems = [
    {
      "question": "What is an Indian Postal PIN Code and why is it important for mail delivery?",
      "answer": "A Postal Index Number (PIN), commonly known as a Pincode, is a unique 6-digit code assigned by the Indian postal service (India Post) to every delivery post office in the country. This code is the backbone of the mail sorting and delivery process. Each digit has a specific geographical meaning: the first digit indicates the postal zone, the second for the sub-zone, the third for the sorting district, and the last three for the specific delivery post office."
    },
    {
      "question": "How can I find a PIN code for a specific area, post office, or postal code?",
      "answer": "Our website provides a powerful and flexible India PIN code search engine. If you know the 6-digit code, you can use the 'Search by Pincode' feature to get a complete list of all post offices associated with that postal code. Simply select a state or enter the name to find details instantly."
    },
    {
      "question": "What kind of post office details can I find when I perform a search?",
      "answer": "Our all India PIN code directory offers comprehensive information for every listed post office, including official Post Office name, 6-digit Pincode, office type (e.g., Head Post Office, Sub-Office, or Branch Office), taluka (sub-district), district, and state."
    }
  ];

export default async function Home() {
  const states = await getStates();
  const t = await getTranslation('en');
  
  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
        <PincodeClientPage states={states} />

        <PincodeZoneList />

        <ImageArticles />
      
        <Card className="w-full shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-2xl font-headline tracking-tight text-center">Post Office & PIN Code Search - FAQ</CardTitle>
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
