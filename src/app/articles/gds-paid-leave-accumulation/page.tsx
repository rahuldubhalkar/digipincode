
import type { Metadata } from 'next';
import { GdsPaidLeaveAccumulationClientPage } from './gds-paid-leave-accumulation-client-page';

const articleInfo = {
    title: "Accumulation of Paid leave without Encashment facilities for Gramin Dak Sevak (GDS)",
};

export const metadata: Metadata = {
  title: articleInfo.title,
  description: `Details on the accumulation of paid leave for Gramin Dak Sevaks (GDS) without encashment facilities.`,
};

export default function GdsPaidLeaveAccumulationPage() {
    return <GdsPaidLeaveAccumulationClientPage />;
}
