
import type { Metadata } from 'next';
import { GdsToMtsResultClientPage } from './gds-to-mts-result-client-page';

const articleInfo = {
    title: "Result of GDSs to Multi-Tasking Staff (MTS) Cadre, held on 31.08.2025 - AP Circle",
};

export const metadata: Metadata = {
  title: articleInfo.title,
  description: `Official results for the promotion of Gramin Dak Sevaks (GDS) to the Multi-Tasking Staff (MTS) cadre in the AP Circle, examination held on 31.08.2025.`,
};

export default function GdsToMtsResultPage() {
    return <GdsToMtsResultClientPage />;
}
