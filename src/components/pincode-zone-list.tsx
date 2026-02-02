
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { pincodeZones } from "@/lib/pincode-zones";
import Link from "next/link";

export function PincodeZoneList() {
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

  return (
    <Card className="w-full shadow-lg border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-headline tracking-tight text-center">Search Postal Circle by First 2 Digits of PINcode</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3 text-sm">
          {pincodeZones.map((zone) => {
             const officialStateName = stateMapping[zone.circle] || zone.circle.toUpperCase();
             const stateUrl = `/state/${officialStateName.replace(/ /g, '-').toLowerCase()}`;
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
