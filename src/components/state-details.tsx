
"use client";

import { useMemo } from 'react';
import type { PostOffice } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface StateDetailsProps {
    selectedState: string;
    allPostOffices: PostOffice[];
    selectedDistrict: string;
    selectedDivision: string;
    onDistrictSelect?: (district: string) => void;
    onDivisionSelect?: (division: string) => void;
}

export function StateDetails({ selectedState, allPostOffices, onDistrictSelect, selectedDistrict, onDivisionSelect, selectedDivision }: StateDetailsProps) {

    const { districts, divisions } = useMemo(() => {
        if (!allPostOffices.length) {
            return { districts: [], divisions: [] };
        }
        const districtSet = new Set<string>();
        const divisionSet = new Set<string>();
        
        allPostOffices.forEach(po => {
            if (po.district) {
                districtSet.add(po.district);
            }
            if (po.divisionname) {
                divisionSet.add(po.divisionname);
            }
        });
        
        return {
            districts: Array.from(districtSet).sort(),
            divisions: Array.from(divisionSet).sort(),
        };
    }, [allPostOffices]);
    
    if (!selectedState || !allPostOffices.length) {
        return null;
    }
    
    const stateUrlPart = selectedState.replace(/ /g, '-').toLowerCase();

    return (
        <Card className="border-none shadow-none">
            <CardContent className="p-0 space-y-4">
                 <p className="text-sm text-muted-foreground">Click on any City/Division below to filter results or view a dedicated page:</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {districts.map(district => {
                        // If onDistrictSelect is passed, it's a button for filtering
                        if (onDistrictSelect) {
                            return (
                                <Button
                                    key={district}
                                    variant="link"
                                    className={cn(
                                        "p-0 h-auto text-muted-foreground hover:text-primary hover:no-underline",
                                        selectedDistrict === district && "text-primary font-bold"
                                    )}
                                    onClick={() => onDistrictSelect(district)}
                                >
                                    {district}
                                </Button>
                            )
                        }
                        
                        // If onDistrictSelect is NOT passed, it's a link for navigation
                        const districtUrl = `/state/${stateUrlPart}/${district.replace(/ /g, '-').toLowerCase()}`;
                        return (
                            <Button
                                key={district}
                                variant="link"
                                asChild
                                className={cn(
                                    "p-0 h-auto text-muted-foreground hover:text-primary hover:no-underline"
                                )}
                            >
                                <Link href={districtUrl}>{district}</Link>
                            </Button>
                        )
                    })}
                </div>

                {divisions.length > 0 && onDivisionSelect && (
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {divisions.map(division => (
                           <Button
                            key={division}
                            variant="link"
                            className={cn(
                                "p-0 h-auto text-muted-foreground hover:text-primary hover:no-underline",
                                selectedDivision === division && "text-primary font-bold"
                            )}
                            onClick={() => onDivisionSelect(division)}
                        >
                            {division}
                        </Button>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
