
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { pincodeZones } from "@/lib/pincode-zones";
import Link from "next/link";

export function PincodeZoneList() {
  // This mapping connects the 'circle' from pincodeZones to the URL slug
  // generated for the static state pages.
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
    };

  return (
    <Card className="w-full shadow-lg border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-headline tracking-tight text-center">Search Postal Circle by First 2 Digits of PINcode</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3 text-sm">
          {pincodeZones.map((zone) => {
             const stateSlug = circleToSlugMap[zone.circle];
             if (!stateSlug) {
                 // Skip rendering if no mapping is found to prevent broken links
                 return null;
             }
             const stateUrl = `/state/${stateSlug}`;
            return (
                <li key={zone.id} className="flex items-start">
                <span className="font-semibold text-muted-foreground w-16 flex-shrink-0">{zone.digits}</span>
                <Link href={stateUrl} className="text-primary hover:underline text-left" aria-label={`Search for ${zone.circle}`}>
                    {zone.circle}
                </Link>
                </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
