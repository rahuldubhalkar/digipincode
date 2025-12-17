import { PincodeFinder } from '@/components/pincode-finder';
import { loadPostOffices } from '@/lib/data';

export default async function Home() {
  const postOffices = await loadPostOffices();

  return (
    <main className="container mx-auto px-4 py-8">
      <PincodeFinder postOffices={postOffices} />
    </main>
  );
}
