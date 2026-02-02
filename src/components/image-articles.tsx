
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { placeholderImages } from '@/lib/placeholder-images';

const imageArticles = [
  {
    href: "/articles/central-pay-commission",
    title: "Urgent operationalisation of the 8th Central Pay Commission",
    image: placeholderImages.centralPayCommission,
    description: "Immediate allotment of office space and commencement of work."
  },
  {
    href: "/articles/dream-app-update",
    title: "Ensuring Upgradation of DREAM App to Version 1.0.28",
    image: placeholderImages.dreamAppUpdate,
    description: "Mandatory upgrade on all MDM Controlled Devices."
  },
  {
    href: "/articles/gds-incentive-scheme",
    title: "Incentive Structure for GDS Postal Staff (BPMs)",
    image: placeholderImages.gdsIncentive,
    description: "Details on incentives for POSB and PM schemes."
  },
  {
    href: "/articles/gds-to-mts-result",
    title: "Result of GDSs to Multi-Tasking Staff (MTS) Cadre",
    image: placeholderImages.gdsToMtsResult,
    description: "AP Circle examination results held on 31.08.2025."
  },
  {
    href: "/articles/ipos-jag-promotion-posting",
    title: "Promotion & Posting in JAG of IPoS, Group 'A'",
    image: placeholderImages.iposJagPromotion,
    description: "Directorate Order dtd 29/12/2025 regarding STS officers."
  },
  {
    href: "/articles/sgb-growth",
    title: "Growth of Sovereign Gold Bond (SGB)",
    image: placeholderImages.sgbGrowth,
    description: "Analysis and data on the growth of SGB sales and performance."
  },
  {
    href: "/articles/gds-paid-leave-accumulation",
    title: "Paid Leave Accumulation for GDS",
    image: placeholderImages.gdsPaidLeaveAccumulation,
    description: "Details on paid leave accumulation without encashment facilities."
  },
  {
    href: "/articles/gds-paid-leave-faq",
    title: "FAQ on Paid Leave of Gramin Dak Sevak (GDS)",
    image: placeholderImages.gdsPaidLeaveFaq,
    description: "Frequently asked questions regarding paid leave for GDS."
  },
  {
    href: "/articles/up-postal-calendar-2026",
    title: "Postal Calendar 2026 - UP Circle",
    image: placeholderImages.upPostalCalendar2026,
    description: "The official Postal Calendar for 2026 for the Uttar Pradesh (UP) Circle."
  }
];

export default function ImageArticles() {
  return (
    <section id="image-articles" className="space-y-8">
      <h2 className="text-3xl font-bold text-center">Latest News and Updates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {imageArticles.map((article) => (
          <Link key={article.href} href={article.href} className="group block">
            <Card className="h-full overflow-hidden transition-all group-hover:shadow-xl">
              <CardHeader className="p-0">
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={article.image.imageUrl}
                    alt={article.title}
                    fill
                    data-ai-hint={article.image.imageHint}
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg leading-tight mb-2 group-hover:text-primary">{article.title}</CardTitle>
                <CardDescription>{article.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
