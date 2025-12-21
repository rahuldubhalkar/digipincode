
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
}

export function StateDetails({ selectedState, allPostOffices, onDistrictSelect, selectedDistrict }: StateDetailsProps) {
    const { t } = useTranslation();

    const { districts, gpos } = useMemo(() => {
        if (!allPostOffices.length) {
            return { districts: [], gpos: [] };
        }
        const districtSet = new Set<string>();
        const gpoList: PostOffice[] = [];
        
        allPostOffices.forEach(po => {
            districtSet.add(po.district);
            if (po.officetype === 'H.O' || po.officetype === 'G.P.O') {
                gpoList.push(po);
            }
        });
        
        return {
            districts: Array.from(districtSet).sort(),
            gpos: gpoList
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
                                    "p-0 h-auto text-muted-foreground hover:text-primary",
                                    selectedDistrict === district && "text-primary font-bold"
                                )}
                                onClick={() => onDistrictSelect(district === selectedDistrict ? '' : district)}
                            >
                                {district}
                            </Button>
                        ))}
                    </div>
                </div>

                {gpos.length > 0 && (
                    <div>
                         <h3 className="text-lg font-bold text-primary mb-2">
                            {t('stateDetails.gpoTitle', { count: gpos.length, state: selectedState })}
                        </h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                            {gpos.map(gpo => (
                                <span key={gpo.officename} className="text-sm">
                                    {gpo.officename} - {gpo.pincode}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
