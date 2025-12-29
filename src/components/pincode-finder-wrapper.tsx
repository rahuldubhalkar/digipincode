
"use client";

import { PincodeFinder } from '@/components/pincode-finder';
import { useCallback, useRef, useState } from 'react';
import type { PostOffice } from '@/lib/types';


interface PincodeFinderWrapperProps {
    states: string[];
    allStatesData: { [state: string]: PostOffice[] };
}

export function PincodeFinderWrapper({ states, allStatesData }: PincodeFinderWrapperProps) {
    const [selectedStateFromZone, setSelectedStateFromZone] = useState('');
    const finderRef = useRef<HTMLDivElement>(null);

    const handleZoneSelect = useCallback((state: string) => {
        setSelectedStateFromZone(state);
        if (finderRef.current) {
          finderRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, []);
      
      const handleClear = useCallback(() => {
        setSelectedStateFromZone('');
      }, []);

    return (
        <div ref={finderRef}>
            <PincodeFinder 
                states={states} 
                allStatesData={allStatesData}
                selectedStateFromZone={selectedStateFromZone} 
                onClear={handleClear} 
            />
        </div>
    )
}
