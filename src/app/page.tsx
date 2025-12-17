import { getStates } from '@/lib/data';
import { PincodeFinderLoader } from '@/components/pincode-finder-loader';

export default async function Home() {
  const states = await getStates();

  return (
    <main className="container mx-auto px-4 py-8">
      <PincodeFinderLoader states={states} />
    </main>
  );
}
