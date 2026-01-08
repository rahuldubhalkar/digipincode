
"use client";

import { PincodeFinder } from '@/components/pincode-finder';
import { PincodeZoneList } from '@/components/pincode-zone-list';
import { useCallback, useRef, useState } from 'react';

interface PincodeFinderWrapperProps {
    states: string[];
}

export function PincodeFinderWrapper({ states }: PincodeFinderWrapperProps) {
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
        <div className='space-y-12' suppressHydrationWarning>
            <div ref={finderRef} className="text-center">
                <h1 className="text-3xl font-bold text-primary mb-2">Indian postal PIN code search</h1>
                <p className="text-muted-foreground">Your complete guide to the Indian postal code system. Use our comprehensive All India PIN Code Finder to search for any postal code or Post Office details by State, District, or Post Office name.</p>
            </div>
            <div ref={finderRef}>
                <PincodeFinder 
                    key={selectedStateFromZone}
                    states={states}
                    selectedStateFromZone={selectedStateFromZone} 
                    onClear={handleClear} 
                />
            </div>
            <PincodeZoneList onZoneSelect={handleZoneSelect} />
        </div>
    )
}
