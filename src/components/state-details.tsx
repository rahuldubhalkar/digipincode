
"use client";

import { useMemo } from 'react';
import type { PostOffice } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/use-translation';

interface StateDetailsProps {
    selectedState: string;
    allPostOffices: PostOffice[];
    onDistrictSelect: (district: string) => void;
    selectedDistrict: string;
    onDivisionSelect: (division: string) => void;
    selectedDivision: string;
}

export function StateDetails({ selectedState, allPostOffices, onDistrictSelect, selectedDistrict, onDivisionSelect, selectedDivision }: StateDetailsProps) {
    const { t } = useTranslation();

    const { districts, divisions } = useMemo(() => {
        if (!allPostOffices.length) {
            return { districts: [], divisions: [] };
        }
        const districtSet = new Set<string>();
        const divisionSet = new Set<string>();
        
        allPostOffices.forEach(po => {
            districtSet.add(po.district);
            divisionSet.add(po.divisionname);
        });
        
        return {
            districts: Array.from(districtSet).sort(),
            divisions: Array.from(divisionSet).sort(),
        };
    }, [allPostOffices]);
    
    if (!selectedState || !allPostOffices.length) {
        return null;
    }

    return (
        <Card className="border-none shadow-none">
            <CardContent className="p-0 space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-primary mb-2">
                        {t('stateDetails.districtsTitle', { count: districts.length, state: selectedState })}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {districts.map(district => (
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
                        ))}
                    </div>
                </div>

                {divisions.length > 0 && (
                    <div>
                         <h3 className="text-lg font-bold text-primary mb-2">
                            {t('stateDetails.divisionsTitle', { count: divisions.length, state: selectedState })}
                        </h3>
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
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
