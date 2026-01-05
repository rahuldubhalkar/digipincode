
import type { Metadata } from 'next';
import { GdsPaidLeaveFaqClientPage } from './gds-paid-leave-faq-client-page';

const articleInfo = {
    title: "FAQ on Paid Leave of Gramin Dak Sevak ( GDS)",
};

export const metadata: Metadata = {
  title: articleInfo.title,
  description: `Frequently asked questions regarding paid leave for Gramin Dak Sevaks (GDS).`,
};

export default function GdsPaidLeaveFaqPage() {
    return <GdsPaidLeaveFaqClientPage />;
}
