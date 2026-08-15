
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { pincodeZones } from "@/lib/pincode-zones";
import { useTranslation } from "@/lib/i18n/use-translation";
import { Button } from "./ui/button";
import Link from "next/link";

interface PincodeZoneListProps {
  onZoneSelect?: (state: string) => void;
}

export function PincodeZoneList({ onZoneSelect }: PincodeZoneListProps) {
  const { t } = useTranslation();

  // Mapping circle names to the URL slugs used in the file system
  const circleToSlugMap: { [key: string]: string } = {
      "Delhi": "delhi",
      "Haryana": "haryana",
      "Punjab": "punjab",
      "Himachal Pradesh": "himachal-pradesh",
      "Jammu & Kashmir": "jammu-and-kashmir",
      "Uttar Pradesh": "uttar-pradesh",
      "Rajasthan": "rajasthan",
      "Gujarat": "gujarat",
      "Maharashtra": "maharashtra",
      "Madhya Pradesh": "madhya-pradesh",
      "Chhattisgarh": "chhattisgarh",
      "Andhra Pradesh": "andhra-pradesh",
      "TELANGANA": "telangana",
      "Karnataka": "karnataka",
      "Tamil Nadu": "tamil-nadu",
      "Kerala": "kerala",
      "Lakshadweep": "lakshadweep",
      "West Bengal": "west-bengal",
      "Andaman & Nicobar": "andaman-and-nicobar-islands",
      "Orissa": "odisha",
      "Assam": "assam",
      "Arunachal Pradesh": "arunachal-pradesh",
      "Manipur": "manipur",
      "Meghalaya": "meghalaya",
      "Mizoram": "mizoram",
      "Nagaland": "nagaland",
      "Tripura": "tripura",
      "Bihar": "bihar",
      "Jharkhand": "jharkhand",
      "Uttarakhand": "uttarakhand",
      "Goa": "goa"
    };

  return (
    <Card className="w-full shadow-lg border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-headline tracking-tight text-center">{t('zoneList.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3 text-sm">
          {pincodeZones.map((zone) => {
             const stateSlug = circleToSlugMap[zone.circle];
             const stateUrl = stateSlug ? `/state/${stateSlug}` : "#";
             
            return (
                <li key={zone.id} className="flex items-start group">
                    <span className="font-semibold text-muted-foreground w-16 flex-shrink-0 group-hover:text-primary transition-colors">{zone.digits}</span>
                    {onZoneSelect ? (
                        <Button
                            variant="link"
                            onClick={() => onZoneSelect(zone.circle)}
                            className="text-primary hover:underline text-left h-auto p-0 font-medium"
                            aria-label={`${t('zoneList.searchFor')} ${zone.circle}`}
                        >
                            {zone.circle}
                        </Button>
                    ) : (
                        <Link
                            href={stateUrl}
                            className="text-primary hover:underline text-left font-medium"
                            aria-label={`${t('zoneList.searchFor')} ${zone.circle}`}
                        >
                            {zone.circle}
                        </Link>
                    )}
                </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
