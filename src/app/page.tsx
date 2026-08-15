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
      {/* Hero Section - Redesigned for Authority and SEO */}
      <section className="bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent border-b pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900">
              <span className="text-primary">India Post</span> Pincode & Tracking
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
              Search the complete directory of 155,000+ Post Offices and get real-time status updates for Speed Post, Registered Post, and all domestic shipments.
            </p>
            
            <Card className="mt-12 border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden text-foreground ring-1 ring-black/5 bg-white rounded-3xl">
              <Tabs defaultValue="track" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-20 bg-slate-100 p-2">
                  <TabsTrigger 
                    value="track" 
                    className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg text-lg font-black transition-all rounded-2xl h-full"
                  >
                    <PackageSearch className="mr-3 h-6 w-6" /> Track Speed Post
                  </TabsTrigger>
                  <TabsTrigger 
                    value="search" 
                    className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg text-lg font-black transition-all rounded-2xl h-full"
                  >
                    <Search className="mr-3 h-6 w-6" /> Pincode Finder
                  </TabsTrigger>
                </TabsList>
                <CardContent className="p-0">
                  <TabsContent value="track" className="m-0 p-8 md:p-14 animate-in fade-in slide-in-from-top-4 duration-500">
                    <TrackingClientPage />
                  </TabsContent>
                  <TabsContent value="search" className="m-0 p-8 md:p-14 animate-in fade-in slide-in-from-top-4 duration-500">
                    <PincodeClientPage states={states} />
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 space-y-20 -mt-10">
        <PincodeZoneList />

        <ImageArticles />
      
        <Card className="shadow-2xl border-none overflow-hidden bg-white rounded-3xl">
          <CardHeader className="bg-slate-50 border-b py-10 px-8">
            <CardTitle className="text-3xl font-black text-center text-slate-900">
              Frequently Asked Questions & Postal Help
            </CardTitle>
            <CardDescription className="text-center text-lg mt-2 font-medium">
              Everything you need to know about Indian Postal Services, Pincodes, and Parcel Tracking.
            </CardDescription>
          </CardHeader>
          <CardContent className="py-12 px-8">
            <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto space-y-4">
                {faqItems.map((item, index) => (
                    <AccordionItem value={`item-${index}`} key={index} className="border border-slate-200 rounded-2xl px-6 transition-all hover:border-primary/20">
                        <AccordionTrigger className="text-left font-black text-xl hover:text-primary transition-colors no-underline py-6">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 text-lg leading-relaxed pb-6">
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
