
import type { Metadata } from 'next';
import { IposJagPromotionPostingClientPage } from './ipos-jag-promotion-posting-client-page';

const articleInfo = {
    title: "Promotion & Posting of STS officers in JAG of IPoS, Group 'A' and Transfer-Posting in JAG - Directorate Order dtd 29/12/2025",
};

export const metadata: Metadata = {
  title: articleInfo.title,
  description: `Directorate order regarding the promotion and posting of STS officers to the JAG of IPoS, Group 'A' and other transfer-postings in the JAG.`,
};

export default function IposJagPromotionPostingPage() {
    return <IposJagPromotionPostingClientPage />;
}
