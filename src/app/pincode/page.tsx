
import type { Metadata } from 'next';
import { PincodeClientPage } from './pincode-client-page';

export const metadata: Metadata = {
  title: 'Search by PIN Code',
  description: 'Enter any 6-digit Indian Postal PIN Code to instantly find Post Office details online. Our fast Pincode search tool provides an accurate post office list for all postal codes in India.',
};

export default function PincodePage() {
  return <PincodeClientPage />;
}
