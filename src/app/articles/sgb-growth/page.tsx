
import type { Metadata } from 'next';
import { SgbGrowthClientPage } from './sgb-growth-client-page';

const articleInfo = {
    title: "Growth of Sovereign Gold Bond (SGB)",
};

export const metadata: Metadata = {
  title: articleInfo.title,
  description: `Analysis and data on the growth of Sovereign Gold Bond (SGB) sales and performance.`,
};

export default function SgbGrowthPage() {
    return <SgbGrowthClientPage />;
}
