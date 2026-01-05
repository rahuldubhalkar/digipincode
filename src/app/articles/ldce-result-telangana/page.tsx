
import type { Metadata } from 'next';
import { LdceResultTelanganaClientPage } from './ldce-result-telangana-client-page';

const articleInfo = {
    title: "Declaration of Result of Limited Departmental Competitive Examination for promotion to the post of Postal Assistant/Sorting Assistant for the vacancy year 2025 - Telangana Circle",
};

export const metadata: Metadata = {
  title: articleInfo.title,
  description: `Result for the LDCE for promotion to Postal Assistant/Sorting Assistant in Telangana Circle for the vacancy year 2025.`,
};

export default function LdceResultTelanganaPage() {
    return <LdceResultTelanganaClientPage />;
}
