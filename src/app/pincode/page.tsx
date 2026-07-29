
import type { Metadata } from 'next';
import { PincodeClientPage } from './pincode-client-page';
import { getStates } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Search by PIN Code or Office Name',
  description: 'Find Indian Post Office details by entering a 6-digit PIN Code or searching by Office Name. Our accurate directory covers all postal circles across India.',
};

export default async function PincodePage() {
  const states = await getStates();
  return <PincodeClientPage states={states} />;
}
