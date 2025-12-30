
import type { Metadata } from 'next';
import { LocationClientPage } from './location-client-page';

export const metadata: Metadata = {
  title: 'My Location',
  description: 'Use the My Location feature to get your current geographic coordinates (latitude and longitude) instantly. Requires browser location permissions.',
};

export default function LocationPage() {
  return <LocationClientPage />;
}
