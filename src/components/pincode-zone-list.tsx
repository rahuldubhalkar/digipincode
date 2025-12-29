"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { pincodeZones } from "@/lib/pincode-zones";
import { useTranslation } from "@/lib/i18n/use-translation";

interface PincodeZoneListProps {
  onZoneSelect: (state: string) => void;
}

export function PincodeZoneList({ onZoneSelect }: PincodeZoneListProps) {
  const { t } = useTranslation();

  const handleStateClick = (state: string) => {
    // A simple mapping for cases where zone name differs from state name in dropdown
    const stateMapping: { [key: string]: string } = {
      "Delhi": "DELHI",
      "Haryana": "HARYANA",
      "Punjab": "PUNJAB",
      "Himachal Pradesh": "HIMACHAL PRADESH",
      "Jammu & Kashmir": "JAMMU AND KASHMIR",
      "Uttar Pradesh": "UTTAR PRADESH",
      "Rajasthan": "RAJASTHAN",
      "Gujarat": "GUJARAT",
      "Maharashtra": "MAHARASHTRA",
      "Madhya Pradesh": "MADHYA PRADESH",
      "Chhattisgarh": "CHHATTISGARH",
      "Andhra Pradesh": "ANDHRA PRADESH",
      "TELANGANA": "TELANGANA",
      "Karnataka": "KARNATAKA",
      "Tamil Nadu": "TAMIL NADU",
      "Kerala": "KERALA",
      "Lakshadweep": "LAKSHADWEEP",
      "West Bengal": "WEST BENGAL",
      "Andaman & Nicobar": "ANDAMAN AND NICOBAR ISLANDS",
      "Orissa": "ODISHA",
      "Assam": "ASSAM",
      "Arunachal Pradesh": "ARUNACHAL PRADESH",
      "Manipur": "MANIPUR",
      "Meghalaya": "MEGHALAYA",
      "Mizoram": "MIZORAM",
      "Nagaland": "NAGALAND",
      "Tripura": "TRIPURA",
      "Bihar": "BIHAR",
      "Jharkhand": "JHARKHAND",
    };
    
    // This component might not be fully functional with the new static approach,
    // but we can connect it in the wrapper if needed.
    // For now, we call the passed function.
    const officialStateName = stateMapping[state] || state.toUpperCase();
    if(onZoneSelect) {
        onZoneSelect(officialStateName);
    }
  };

  return (
    <Card className="w-full shadow-lg border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-headline tracking-tight text-center">{t('zoneList.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3 text-sm">
          {pincodeZones.map((zone) => (
            <li key={zone.id} className="flex items-start">
              <span className="font-semibold text-muted-foreground w-16 flex-shrink-0">{zone.digits}</span>
              <button
                onClick={() => handleStateClick(zone.circle)}
                className="text-primary hover:underline text-left"
                aria-label={`${t('zoneList.searchFor')} ${zone.circle}`}
              >
                {zone.circle}
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
