"use client";

import { PincodeFinderLoader } from '@/components/pincode-finder-loader';
import { PincodeZoneList } from '@/components/pincode-zone-list';
import { getStates } from '@/lib/data';
import { useEffect, useState, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [states, setStates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStateFromZone, setSelectedStateFromZone] = useState('');
  const finderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getStates().then(states => {
      setStates(states);
      setIsLoading(false);
    });
  }, []);

  const handleZoneSelect = (state: string) => {
    setSelectedStateFromZone(state);
    if (finderRef.current) {
      finderRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
      <div ref={finderRef}>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <PincodeFinderLoader states={states} selectedStateFromZone={selectedStateFromZone} />
        )}
      </div>
      
      {!isLoading && <PincodeZoneList onZoneSelect={handleZoneSelect} />}
    </main>
  );
}
