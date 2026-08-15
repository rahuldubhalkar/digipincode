import { getStates } from '@/lib/data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ImageArticles from '@/components/image-articles';
import { PincodeZoneList } from '@/components/pincode-zone-list';
import { PincodeClientPage } from './pincode/pincode-client-page';
import { TrackingClientPage } from './tracking/tracking-client-page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, PackageSearch } from 'lucide-react';

const faqItems = [
    {
      "question": "How do I find an Indian PIN Code for my area?",
      "answer": "You can find any Indian PIN code by using our search directory. Simply select your state and district, or search directly by the post office name. Each PIN code is a 6-digit number where the first digit represents the region, the second the sub-region, the third the sorting district, and the last three digits represent the specific delivery post office."
    },
    {
      "question": "Can I track my Speed Post parcel here?",
      "answer": "Yes, our real-time India Post tracking tool allows you to track Speed Post, Registered Post, and other domestic and international parcels. Simply enter your tracking number (e.g., EB123456789IN) in the tracking tab above."
    },
    {
      "question": "What is the format of an India Post tracking number?",
      "answer": "Most India Post tracking numbers consist of 13 alphanumeric characters. They typically start with two letters (like 'EB' for Speed Post), followed by nine digits, and end with the country code 'IN'."
    },
    {
      "question": "Are the PIN codes updated?",
      "answer": "Yes, we use the official All India Pincode Directory dataset provided by the Government of India. This ensures that you get the most accurate and up-to-date postal information available on record."
    }
];

export default async function Home() {
  const states = await getStates();
  
  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* Hero Section - Themed with Red and Neutral colors */}
      <section className="bg-muted/30 border-b pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-primary">
              India Post Pincode & Tracking
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Real-time parcel tracking and accurate PIN code directory for 155,000+ Indian Post Offices.
            </p>
            
            <Card className="mt-10 border-none shadow-2xl overflow-hidden text-foreground ring-1 ring-black/5">
              <Tabs defaultValue="search" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-16 bg-muted/80 p-1">
                  <TabsTrigger value="search" className="data-[state=active]:bg-white data-[state=active]:text-primary text-lg font-black transition-all">
                    <Search className="mr-2 h-5 w-5" /> Search Pincode
                  </TabsTrigger>
                  <TabsTrigger value="track" className="data-[state=active]:bg-white data-[state=active]:text-primary text-lg font-black transition-all">
                    <PackageSearch className="mr-2 h-5 w-5" /> Track Parcel
                  </TabsTrigger>
                </TabsList>
                <CardContent className="p-0">
                  <TabsContent value="search" className="m-0 p-6 md:p-10">
                    <PincodeClientPage states={states} />
                  </TabsContent>
                  <TabsContent value="track" className="m-0 p-6 md:p-10">
                    <TrackingClientPage />
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 space-y-16 -mt-12">
        <PincodeZoneList />

        <ImageArticles />
      
        <Card className="shadow-xl border-none overflow-hidden">
          <CardHeader className="bg-muted/50 border-b py-8">
            <CardTitle className="text-3xl font-black text-center text-secondary">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
                {faqItems.map((item, index) => (
                    <AccordionItem value={`item-${index}`} key={index} className="border-b last:border-0 py-2">
                        <AccordionTrigger className="text-left font-black text-xl hover:text-primary transition-colors no-underline">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-lg leading-relaxed pt-2">
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
