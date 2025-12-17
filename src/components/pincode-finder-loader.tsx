"use client";

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const PincodeFinder = dynamic(() => import('@/components/pincode-finder').then(mod => mod.PincodeFinder), { 
  ssr: false,
  loading: () => <div className="space-y-4">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-64 w-full" />
  </div>
});

export function PincodeFinderLoader({ states }: { states: string[] }) {
  return <PincodeFinder states={states} />;
}
