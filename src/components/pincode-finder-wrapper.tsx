
"use client";

import { PincodeFinder } from '@/components/pincode-finder';
import { PincodeZoneList } from '@/components/pincode-zone-list';

interface PincodeFinderWrapperProps {
    states: string[];
}

export function PincodeFinderWrapper({ states }: PincodeFinderWrapperProps) {
    return (
        <div className='space-y-12' suppressHydrationWarning>
            <PincodeFinder states={states} />
            <PincodeZoneList />
        </div>
    )
}
