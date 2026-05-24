
import type { Metadata } from 'next';
import { GdsIncentiveSchemeClientPage } from './gds-incentive-scheme-client-page';

const articleInfo = {
    title: "Incentive Structure for GDS Postal Staff (BPMs) on POSB Schemes",
};

export const metadata: Metadata = {
  title: articleInfo.title,
  description: `Details on the incentive structure for Gramin Dak Sevaks (GDS) and Branch Post Masters (BPMs) related to Post Office Savings Bank (POSB) schemes.`,
};

export default function GdsIncentiveSchemePage() {
    return <GdsIncentiveSchemeClientPage />;
}
