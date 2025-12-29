"use client";

import dynamic from 'next/dynamic';
import { PincodeFinderProps } from './pincode-finder';
import { Skeleton } from './ui/skeleton';

function PincodeFinderSkeleton() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex justify-center pt-4">
                <Skeleton className="h-10 w-28" />
            </div>
            <div className="max-w-3xl mx-auto border rounded-lg p-6">
                <Skeleton className="h-8 w-1/2 mx-auto mb-4" />
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
      </div>
    )
}

const PincodeFinder = dynamic(() => import('@/components/pincode-finder').then(mod => mod.PincodeFinder), {
  ssr: false,
  loading: () => <PincodeFinderSkeleton />,
});

export function PincodeFinderLoader(props: PincodeFinderProps) {
  return <PincodeFinder {...props} />;
}
