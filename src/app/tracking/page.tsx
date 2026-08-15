
import type { Metadata } from 'next';
import { TrackingClientPage } from './tracking-client-page';

export const metadata: Metadata = {
  title: 'India Post Tracking | Speed Post Parcel Tracker',
  description: 'Track your India Post, Speed Post, and registered parcels online. Get real-time status updates, delivery history, and current location for your Indian postal shipments.',
  keywords: ['india post tracking', 'speed post tracking', 'parcel tracking india', 'post office tracking', 'track speed post', 'indian post tracker'],
};

export default function TrackingPage() {
  return <TrackingClientPage />;
}
