
import { getStates } from '@/lib/data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ImageArticles from '@/components/image-articles';
import { PincodeZoneList } from '@/components/pincode-zone-list';
import { SearchForm } from '@/components/search-form';

const faqItems = [
    {
      "question": "What is an Indian Postal PIN Code and why is it important for mail delivery?",
      "answer": "A Postal Index Number (PIN), commonly known as a Pincode, is a unique 6-digit code assigned by the Indian postal service (India Post) to every delivery post office in the country. This code is the backbone of the mail sorting and delivery process. Each digit has a specific geographical meaning: the first digit indicates the postal zone, the second for the sub-zone, the third for the sorting district, and the last three for the specific delivery post office. Using the correct Pincode from our all India post office PIN code directory is crucial because it ensures that mail and packages are routed through the correct channels, minimizing delays and preventing misdelivery. An accurate PIN code search guarantees that your correspondence reaches its destination swiftly."
    },
    {
      "question": "How can I find a PIN code for a specific area, post office, or postal code?",
      "answer": "Our website provides a powerful and flexible India PIN code search engine. If you know the 6-digit code, you can use the 'Search by Pincode' feature to get a complete list of all post offices associated with that postal code. If you only know the general location, our homepage allows you to explore the entire post office directory. Simply select a state from the dropdown menu, and you can then filter the results by district or postal division. This feature is perfect for finding PIN code details even if you don't know the exact code, making our tool a comprehensive online postal code finder for all of India."
    },
    {
      "question": "What kind of post office details can I find when I perform a search?",
      "answer": "Our all India PIN code directory offers comprehensive information for every listed post office. When you conduct a search by PIN code or location, our tool provides the official Post Office name, its 6-digit Pincode, the office type (e.g., Head Post Office, Sub-Office, or Branch Office), taluka (sub-district), district, and state. We also provide higher-level administrative details like the postal Division, Region, and Circle, giving you a complete overview of the post office's place within the Indian postal network."
    },
    {
      "question": "Is it possible to get a complete post office list for an entire state?",
      "answer": "Yes, absolutely. To get a detailed post office list by state, simply choose your desired state from the dropdown menu on our homepage. This will load all the post offices within that state. To make navigation easier, you can then use the filters to narrow down the list by a specific postal division or district. This feature allows you to explore the entire India post office PIN code directory for any state, making it easy to find the postal code details you need, district by district."
    },
    {
      "question": "What are the different types of post offices, such as Head Post Office (H.O.) and Branch Post Office (B.O.)?",
      "answer": "The Indian postal system is organized hierarchically to ensure efficient service delivery. A Head Post Office (H.O.) or General Post Office (G.P.O.) serves as the main post office in a postal district, managing the smaller offices within its jurisdiction. A Sub-Post Office (S.O.) is a smaller, mid-level office typically located in towns, and a Branch Post Office (B.O.) is usually found in rural areas, offering basic postal services. Our postal code directory includes detailed information for all office types, ensuring you can find any post office, from a major city G.P.O. to a small village B.O."
    },
    {
      "question": "How can I be sure that your post office database and PIN code list are accurate?",
      "answer": "Our service is built on the official All India Pincode Directory, a comprehensive dataset made publicly available by the Government of India. By using this authoritative source, we guarantee that our online post office search provides the most accurate, reliable, and up-to-date post office and Pincode details available on record for India. We regularly synchronize our data to maintain its freshness and ensure our India PIN code list remains the most dependable resource for your postal code search needs."
    },
    {
      "question": "How do I find specific post office details if I only know the PIN code?",
      "answer": "If you have a 6-digit PIN code and need to find the corresponding post office details, our tool makes it simple. Navigate to the 'Search by Pincode' page using the main menu. Enter the complete Indian Postal PIN Code into the search field and click the 'Search' button. The page will immediately display a detailed list of all post offices operating under that specific postal code, including their official names, office types (B.O., S.O., H.O.), and the districts they serve. It's the fastest way to get postal code details when you have the code."
    }
  ];

const faqTitle = "Post Office & PIN Code Search - Frequently Asked Questions";

export default async function Home() {
  const states = await getStates();
  
  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
        <Card className="w-full shadow-lg border-none">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-headline tracking-tight text-primary">Indian postal PIN code search</CardTitle>
                <CardDescription>Your complete guide to the Indian postal code system. Use our comprehensive All India PIN Code Finder to search for any postal code or Post Office details by State, District, or Post Office name.</CardDescription>
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
