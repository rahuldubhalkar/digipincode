"use client";

import { PincodeFinderLoader } from '@/components/pincode-finder-loader';
import { getStates } from '@/lib/data';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [states, setStates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStates().then(states => {
      setStates(states);
      setIsLoading(false);
    });
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <PincodeFinderLoader states={states} />
      )}
    </main>
  );
}
