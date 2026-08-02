
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface StateDetailsProps {
    selectedState: string;
    districts: string[];
    selectedDistrict: string;
    selectedDivision: string;
    onDistrictSelect?: (district: string) => void;
    onDivisionSelect?: (division: string) => void;
}

export function StateDetails({ selectedState, districts, onDistrictSelect, selectedDistrict }: StateDetailsProps) {
    if (!selectedState || !districts.length) {
        return null;
    }
    
    const stateUrlPart = selectedState.replace(/ /g, '-').toLowerCase();

    return (
        <Card className="border-none shadow-none">
            <CardContent className="p-0 space-y-6">
                 <div className="space-y-4">
                    <p className="text-sm font-medium text-muted-foreground">Select a district to view all its PIN codes and post offices:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        {districts.map(district => {
                            if (!district) return null;
                            
                            // If an onDistrictSelect handler is passed, it's for the home page filters
                            if (onDistrictSelect) {
                                return (
                                    <Button
                                        key={district}
                                        variant="outline"
                                        size="sm"
                                        suppressHydrationWarning
                                        className={cn(
                                            "justify-start text-xs h-auto py-2 px-3 whitespace-normal text-left transition-colors",
                                            selectedDistrict === district 
                                                ? "bg-primary text-primary-foreground border-primary" 
                                                : "hover:bg-primary/10 hover:text-primary"
                                        )}
                                        onClick={() => onDistrictSelect(district)}
                                    >
                                        {district}
                                    </Button>
                                )
                            }
                            
                            // Otherwise, it's a direct navigation link for the landing pages
                            const districtUrl = `/state/${stateUrlPart}/${district.replace(/ /g, '-').toLowerCase()}`;
                            return (
                                <Link 
                                    key={district} 
                                    href={districtUrl}
                                    className="flex items-center p-2 rounded-md border border-input hover:border-primary hover:bg-primary/5 transition-all text-xs font-medium text-muted-foreground hover:text-primary"
                                >
                                    {district}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
