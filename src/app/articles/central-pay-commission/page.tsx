
import type { Metadata } from 'next';
import { CentralPayCommissionClientPage } from './central-pay-commission-client-page';

const articleInfo = {
    title: "Urgent operationalisation of the 8th Central Pay Commission – Immediate allotment of office space and commencement of work",
};

export const metadata: Metadata = {
  title: articleInfo.title,
  description: `Read the latest update on the 8th Central Pay Commission, concerning the immediate allotment of office space and commencement of work.`,
};

export default function CentralPayCommissionPage() {
    return <CentralPayCommissionClientPage />;
}
