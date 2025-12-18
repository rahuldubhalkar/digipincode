"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getStates } from '@/lib/data';

const PincodeFinder = dynamic(() => import('@/components/pincode-finder').then(mod => mod.PincodeFinder), { 
  ssr: false,
  loading: () => <div className="space-y-4">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-64 w-full" />
  </div>
});

export function PincodeFinderLoader() {
  const [states, setStates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStates().then(states => {
      setStates(states);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return <PincodeFinder states={states} />;
}
