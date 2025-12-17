import { loadPostOffices } from '@/lib/data';
import { PincodeFinderLoader } from '@/components/pincode-finder-loader';

export default async function Home() {
  const postOffices = await loadPostOffices();

  return (
    <main className="container mx-auto px-4 py-8">
      <PincodeFinderLoader postOffices={postOffices} />
    </main>
  );
}
